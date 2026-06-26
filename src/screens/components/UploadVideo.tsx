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
import { CloudUpload, HardDriveUpload, Lightbulb } from 'lucide-react-native';

interface UploadVideoProps {
  buttonLabel?: string;
  modalTitle?: string;
  dropTitle?: string;
  fileTypesText?: string;
}

export default function UploadVideo({
  buttonLabel = 'Upload Video ',
  modalTitle = 'Upload Video Introduction',
  dropTitle = 'Drag and drop your video here',
  fileTypesText = 'MP4, MOV, AVI, WebM * Max file size: 100MB',
}: UploadVideoProps) {
  const [showModal, setShowModal] = useState(false);
  const [videoTitle, setVideoTitle] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');

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
    } catch (err: any) {
      if (DocumentPicker.isCancel(err)) {
        return;
      }
      Alert.alert('Error', err.message || 'Unable to select file.');
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
        <HardDriveUpload fill={'#165DFC'} color={'#165DFC'} />
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
              onChangeText={setVideoTitle}
              placeholder="Enter a title for your video"
              placeholderTextColor="#9CA3AF"
            />
            <Text style={styles.introVideoValidation}>0/100 characters</Text>
            <View style={styles.introVideoGuidelines}>
              <Text style={styles.introVideoGuidelinesTitle}><Lightbulb size={16}  fill="#10388B" />Video Guidelines</Text>
              <Text style={styles.introVideoGuidelineText}>• Keep it professional and concise</Text>
              <Text style={styles.introVideoGuidelineText}>• Use MP4 or MOV file format</Text>
              <Text style={styles.introVideoGuidelineText}>• Your video will be reviewed before approval</Text>
            </View>
            <TouchableOpacity style={styles.introVideoActionButton}>
              <Text style={styles.introVideoActionButtonText}>{buttonLabel}</Text>
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
  introVideoValidation:{
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
  introVideoActionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Geist-VariableFont_wght',
  },
});
