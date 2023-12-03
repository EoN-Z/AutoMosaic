import time
from deepface import DeepFace
import cv2
from retinaface import RetinaFace

test_flag = True

input_video_url = "/home/chanwoo4267/web-automosaic/backend/media/input.mp4"
output_video_url = "/home/chanwoo4267/web-automosaic/backend/media/output.avi"
faces_directory_path = "/home/chanwoo4267/web-automosaic/backend/media/faces/"

detected_face_list = list()

def detect_by_time(cap, given_time):
    total_frames = cap.get(cv2.CAP_PROP_FRAME_COUNT)
    fps = cap.get(cv2.CAP_PROP_FPS)
    current_frame = given_time * fps

    if (current_frame >= total_frames):
        return False, None
    return True, current_frame - 1


def capture_frame_faces(times):
    idx = 0
    result_list = list()

    print("capture_frame_faces_call")

    cap = cv2.VideoCapture(input_video_url)
    for time in times:
        res, frame = detect_by_time(cap, time)
        if (res == False):
            continue
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame)
        res, frame = cap.read()
        detected_faces = RetinaFace.extract_faces(frame, align=True)

        # debug
        print(len(detected_faces))

        for retina_face in detected_faces:
            cv2.imwrite(faces_directory_path + str(idx) + ".png", cv2.cvtColor(retina_face, cv2.COLOR_RGB2BGR)) # save image in RGB format, not BGR
            idx += 1
            result_list.append(retina_face)
    
    return True, result_list


def facelist(times):
    if test_flag:
        time.sleep(1)
        return 5
    
    global detected_face_list
    result, detected_face_list = capture_frame_faces(times)
    return len(detected_face_list)


def mosaic_video(bool_faces):
    global detected_face_list
    cap = cv2.VideoCapture(input_video_url)
    v = 50 # mosaic size

    frame_width = int(cap.get(3))  # Width of the frames in the video
    frame_height = int(cap.get(4))  # Height of the frames in the video
    fps = cap.get(cv2.CAP_PROP_FPS)

    fourcc = cv2.VideoWriter_fourcc(*'XVID')
    out = cv2.VideoWriter(output_video_url, fourcc, fps, (frame_width, frame_height)) # save video

    search_faces = list()

    #debug
    print(len(detected_face_list))

    for i in range(len(detected_face_list)):
        if bool_faces[i] == True:
            search_faces.append(detected_face_list[i])

    # for faces in detected_face_list:
    #     search_faces.append(faces)
    
    #debug
    print("search_faces : ", len(search_faces))
    
    while(True):
        ret, frame = cap.read()
        if not ret: # if video is over
            break

        faces = RetinaFace.detect_faces(frame)
        for i in range(len(faces)):
            # debug
            print("current face : ", i)

            temp_str = 'face_' + str(i+1)
            startX = faces[temp_str]['facial_area'][0]
            startY = faces[temp_str]['facial_area'][1]
            endX = faces[temp_str]['facial_area'][2]
            endY = faces[temp_str]['facial_area'][3]

            unmosaic_flag = False

            for sface in search_faces:
                obj = DeepFace.verify(img1_path = sface, img2_path = frame[startY:endY, startX:endX], model_name = "VGG-Face", enforce_detection = False, detector_backend = 'retinaface')
                # modify detector_backend to retinaface
                if (obj["distance"] < 0.3) :
                    unmosaic_flag = True
                    break
            
            if (unmosaic_flag == False) :
                # mosaic
                roi_f = frame[startY:endY, startX:endX]
                roi = cv2.resize(roi_f, (roi_f.shape[1] // v, roi_f.shape[0] // v))
                roi = cv2.resize(roi, (roi_f.shape[1], roi_f.shape[0]), interpolation=cv2.INTER_AREA)
                frame[startY:endY, startX:endX] = roi
        
        out.write(frame)

    cap.release()
    out.release()
    return True


def domosaic(faces):
    if test_flag:
        time.sleep(1)
        return
    
    print(faces)
    result = mosaic_video(faces)