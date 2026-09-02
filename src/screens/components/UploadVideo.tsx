import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ActionSheetIOS,
  Alert,
  Platform,
} from 'react-native';
// import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';
import DocumentPicker, { types } from 'react-native-document-picker';
import { CloudUpload, HardDriveUpload, Lightbulb, RotateCw } from 'lucide-react-native';
import { uploadVideo } from '../../Redux/slices/profileSlice';
import { useDispatch } from 'react-redux';
import * as AsyncStore from '../../AsyncStore';

interface UploadVideoProps {
  buttonLabel?: string;
  modalTitle?: string;
  dropTitle?: string;
  fileTypesText?: string;
  onVideoTitleChange?: (title: string) => void;
  onUploadSuccess?: (response: any) => void;
  hasVideo?: boolean;
}

export default function UploadVideo({
  buttonLabel = 'Upload Video ',
  modalTitle = 'Upload Video Introduction',
  dropTitle = 'Drag and drop your video here',
  fileTypesText = 'MP4, MOV, AVI, WebM * Max file size: 100MB',
  onVideoTitleChange = (title: string) => { },
  onUploadSuccess = (response: any) => { },
  hasVideo = false,
}: UploadVideoProps) {
  const [showModal, setShowModal] = useState(false);
  const [videoTitle, setVideoTitle] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const dispatch = useDispatch();


  const handlePickerResponse = (response: any) => {
    if (response.didCancel) {
      return;
    }

    if (response.errorCode) {
      Alert.alert('Error', response.errorMessage || 'Unable to select file.');
      return;
    }

    const asset = response.assets && response.assets[0];
    if (asset) {
      setSelectedFileName(asset.fileName || asset.uri || 'Selected file');
    }
  };

  //   const pickFromGallery = () => {
  //     const options: ImageLibraryOptions = {
  //       mediaType: 'video',
  //       selectionLimit: 1,
  //     };
  //     launchImageLibrary(options, handlePickerResponse);
  //   };

  const pickFromFiles = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [types.pdf, types.doc, types.docx, types.video, types.images, types.plainText],
      });
      setSelectedFileName(result.name ?? result.uri ?? 'Selected file');
      setSelectedFile(result);
      if (!videoTitle && result.name) {
        setVideoTitle(result.name);
        onVideoTitleChange?.(result.name);
      }
    } catch (err: any) {
      if (DocumentPicker.isCancel(err)) {
        return;
      }
      Alert.alert('Error', err.message || 'Unable to select file.');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      Alert.alert('Error', 'Please select a video file first.');
      return;
    }

    try {
      setIsUploading(true);
      const userId = await AsyncStore.getData(AsyncStore.Keys.USER_ID);
      const resultUserId = userId ? userId.replace(/"/g, '') : '';

      const formData = new FormData();
      formData.append('video', {
        uri: selectedFile.uri,
        type: selectedFile.type || 'video/mp4',
        name: selectedFile.name || 'video.mp4',
      } as any);
      formData.append('title', videoTitle || selectedFile.name || 'Untitled video');
      formData.append('userId', resultUserId);

      const response = await dispatch(uploadVideo(formData) as any);
      if (uploadVideo.fulfilled.match(response)) {
        Alert.alert('Success', 'Video uploaded successfully.');
        setShowModal(false);
        onUploadSuccess(response.payload);
      } else {
        const message = (response.payload as any)?.message || 'Failed to upload video.';
        Alert.alert('Error', message);
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Unable to upload video.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleBrowsePress = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Choose from Gallery', 'Choose from Files'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            // pickFromGallery();
          } else if (buttonIndex === 2) {
            pickFromFiles();
          }
        }
      );
    } else {
      //   pickFromGallery();
    }
  };
  return (
    <>
      <TouchableOpacity style={styles.uploadVideoButton} onPress={() => setShowModal(true)}>
        {hasVideo ? (<RotateCw size={18}  color={'#165DFC'} />) : (<HardDriveUpload size={24} fill={'#165DFC'} color={'#165DFC'} />)}
        <Text style={styles.uploadVideoText}>{buttonLabel}</Text>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.introVideoOverlay}>
          <TouchableOpacity
            style={styles.introVideoBackdrop}
            activeOpacity={1}
            onPress={() => setShowModal(false)}
          />
          <View style={styles.introVideoContainer}>
            <View style={styles.introVideoHeader}>
              <Text style={styles.introVideoTitle}>{modalTitle}</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text style={styles.introVideoClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.introVideoSectionTitle}>Select Video File</Text>
            <View style={styles.introVideoDropZone}>
              <CloudUpload size={30} color="#6B7280" />
              <Text style={styles.introVideoDropTitle}>{dropTitle}</Text>
              <Text style={styles.introVideoDropHint}>or</Text>
              <TouchableOpacity style={styles.introVideoBrowseButton} onPress={handleBrowsePress}>
                <Text style={styles.introVideoBrowseText}>Browse files</Text>
              </TouchableOpacity>
              {selectedFileName ? (
                <Text style={styles.introVideoSelectedFile}>{selectedFileName}</Text>
              ) : (
                <Text style={styles.introVideoFileTypes}>{fileTypesText}</Text>
              )}
            </View>
            <Text style={styles.introVideoSectionTitle}>Video Title</Text>
            <TextInput
              style={styles.introVideoInput}
              value={videoTitle}
              onChangeText={(text) => {
                setVideoTitle(text);
                onVideoTitleChange?.(text);
              }}
              placeholder="Enter a title for your video"
              placeholderTextColor="#9CA3AF"
            />
            <Text style={styles.introVideoValidation}>0/100 characters</Text>
            <View style={styles.introVideoGuidelines}>
              <Text style={styles.introVideoGuidelinesTitle}><Lightbulb size={16} fill="#10388B" />Video Guidelines</Text>
              <Text style={styles.introVideoGuidelineText}>• Keep it professional and concise</Text>
              <Text style={styles.introVideoGuidelineText}>• Use MP4 or MOV file format</Text>
              <Text style={styles.introVideoGuidelineText}>• Your video will be reviewed before approval</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.introVideoActionButton,
                !videoTitle.trim() && styles.introVideoActionButtonDisabled,
              ]}
              onPress={handleUpload}
              disabled={isUploading || !videoTitle.trim()}
            >
              <Text style={styles.introVideoActionButtonText}>
                {isUploading ? 'Uploading...' : buttonLabel}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  uploadVideoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '50%',
    marginBottom: 16,
    backgroundColor: '#DBE9FF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  uploadVideoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#165DFC',
    fontFamily: 'Geist-VariableFont_wght',
  },
  introVideoOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  introVideoBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  introVideoContainer: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 25,
    elevation: 12,
  },
  introVideoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  introVideoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
  },
  introVideoClose: {
    fontSize: 22,
    color: '#9CA3AF',
    fontFamily: 'Geist-VariableFont_wght',
  },
  introVideoSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 10,
  },
  introVideoDropZone: {
    width: '100%',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 16,
    backgroundColor: '#F8FAFF',
    paddingVertical: 28,
    paddingHorizontal: 18,
    alignItems: 'center',
    marginBottom: 20,
  },
  introVideoDropIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  introVideoDropTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
    textAlign: 'center',
    marginBottom: 10,
  },
  introVideoDropHint: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 12,
  },
  introVideoBrowseButton: {
    backgroundColor: '#DBE9FF',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  introVideoBrowseText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#165DFC',
    fontFamily: 'Geist-VariableFont_wght',
  },
  introVideoSelectedFile: {
    fontSize: 12,
    color: '#4B5563',
    fontFamily: 'Geist-VariableFont_wght',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  introVideoFileTypes: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Geist-VariableFont_wght',
    textAlign: 'center',
  },
  introVideoInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 18,
  },
  introVideoGuidelines: {
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  introVideoGuidelinesTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10388B',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 8,
  },
  introVideoGuidelineText: {
    fontSize: 12,
    color: '#4B5563',
    fontFamily: 'Geist-VariableFont_wght',
    lineHeight: 18,
  },
  introVideoValidation: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Geist-VariableFont_wght',
    textAlign: 'left',
    marginBottom: 12,
  },
  introVideoActionButton: {
    backgroundColor: '#165DFC',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  introVideoActionButtonDisabled: {
    backgroundColor: '#9CAEFB',
  },
  introVideoActionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Geist-VariableFont_wght',
  },
});
