import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { X, Zap, Heart } from 'lucide-react-native/icons';
import ApplyJobModal from './ApplyJobModal';

interface JobDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  job: any;
  onQuickApply?: (jobId: string) => void;
  onApplyNow?: (jobId: string) => void;
  onSaveJob?: (jobId: string) => void;
}

function underscoreToSpace(str: any) {
  return str ? str.replace(/_/g, ' ') : '';
}

export default function JobDetailsModal({
  visible,
  onClose,
  job,
  onQuickApply,
  onApplyNow,
  onSaveJob,
}: JobDetailsModalProps) {
  const matchScore = job?.match_score ?? job?.match_percentage;
  const [showApplyModal, setShowApplyModal] = useState(false);

  const handleApplicationReview = () => {
    setShowApplyModal(false);
    // onClose();
  };

  const handleBrowseMoreJobs = () => {
    setShowApplyModal(false);
    // onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Job Details</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={18} color="#363535" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.titleRow}>
              <View style={styles.companyLogo}>
                <Text style={styles.companyInitials}>{job?.companies?.name?.charAt(0) ?? job?.company?.charAt(0)}</Text>
              </View>
              <View style={styles.titleInfo}>
                <Text style={styles.jobTitle}>{job?.title}</Text>
                <Text style={styles.jobSubtitle}>
                  {job?.companies?.name ?? job?.company} • {job?.location}
                </Text>
              </View>
            </View>

            {matchScore != null && (
              <View style={styles.matchCard}>
                <Text style={styles.matchTitle}>{matchScore}% Match</Text>
                <Text style={styles.matchSubtitle}>Your skills align well with this role</Text>
              </View>
            )}

            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.quickApplyButton}
                onPress={() => onQuickApply?.(job?.id)}
              >
                <Zap size={16} color="#FFFFFF" />
                <Text style={styles.quickApplyText}>Quick Apply</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyNowButton}
                onPress={() => {
                  onApplyNow?.(job?.id);
                  setShowApplyModal(true);
                }}
              >
                <Text style={styles.applyNowText}>Apply Now</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.saveJobButton} onPress={() => onSaveJob?.(job?.id)}>
              <Heart size={16} color="#363535" />
              <Text style={styles.saveJobText}>Save Job</Text>
            </TouchableOpacity>

            {job?.description ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Job Description</Text>
                <Text style={styles.sectionText}>{job.description}</Text>
              </View>
            ) : null}

            {job?.requirements ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Requirements</Text>
                <Text style={styles.sectionText}>{job.requirements}</Text>
              </View>
            ) : null}

            {job?.responsibilities ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Responsibilities</Text>
                <Text style={styles.sectionText}>{job.responsibilities}</Text>
              </View>
            ) : null}

            {job?.benefits ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Benefits</Text>
                <Text style={styles.sectionText}>{job.benefits}</Text>
              </View>
            ) : null}

            {job?.employment_type ? (
              <Text style={styles.employmentType}>{underscoreToSpace(job.employment_type)}</Text>
            ) : null}
          </ScrollView>
        </View>
      </View>

      <ApplyJobModal
        visible={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        onSubmit={handleApplicationReview}
        onBrowseMoreJobs={handleBrowseMoreJobs}
        job={job}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEBEE',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  companyLogo: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  companyInitials: {
    fontSize: 16,
    fontWeight: '600',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
  },
  titleInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#181818',
    fontFamily: 'Geist-VariableFont_wght',
  },
  jobSubtitle: {
    fontSize: 13,
    color: '#797979',
    fontFamily: 'Geist-VariableFont_wght',
    marginTop: 2,
  },
  matchCard: {
    backgroundColor: '#E8F9EE',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  matchTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F9D55',
    fontFamily: 'Geist-VariableFont_wght',
  },
  matchSubtitle: {
    fontSize: 12,
    color: '#1F9D55',
    fontFamily: 'Geist-VariableFont_wght',
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  quickApplyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#8B3DFF',
    borderRadius: 8,
    paddingVertical: 14,
  },
  quickApplyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Geist-VariableFont_wght',
  },
  applyNowButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#165DFC',
    borderRadius: 8,
    paddingVertical: 14,
  },
  applyNowText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Geist-VariableFont_wght',
  },
  saveJobButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 14,
    marginBottom: 20,
  },
  saveJobText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#181818',
    fontFamily: 'Geist-VariableFont_wght',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#4A5565',
    fontFamily: 'Geist-VariableFont_wght',
  },
  employmentType: {
    fontSize: 12,
    color: '#797979',
    fontFamily: 'Geist-VariableFont_wght',
  },
});
