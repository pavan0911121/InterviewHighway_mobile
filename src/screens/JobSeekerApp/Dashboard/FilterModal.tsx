import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
} from 'react-native';
import { X, Check } from 'lucide-react-native';
import Slider from '@react-native-community/slider';

interface Filters {
  location: {
    remote: boolean;
    thirupati: boolean;
  };
  experience: {
    entryLevel: boolean;
    midLevel: boolean;
  };
  salary: number;
  jobType: {
    fullTime: boolean;
    partTime: boolean;
  };
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: Filters) => void;
}

const INITIAL_FILTERS: Filters = {
  location: {
    remote: false,
    thirupati: false,
  },
  experience: {
    entryLevel: false,
    midLevel: false,
  },
  salary: 100000,
  jobType: {
    fullTime: false,
    partTime: false,
  },
};

export default function FilterModal({ visible, onClose, onApply }: FilterModalProps) {
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const [expandedSection, setExpandedSection] = useState<string>('location');

  const handleCheckboxChange = (category: string, option: string) => {
    setFilters((prev) => {
      const updated = { ...prev };
      if (category === 'location') {
        updated.location[option as keyof typeof updated.location] =
          !updated.location[option as keyof typeof updated.location];
      } else if (category === 'experience') {
        updated.experience[option as keyof typeof updated.experience] =
          !updated.experience[option as keyof typeof updated.experience];
      } else if (category === 'jobType') {
        updated.jobType[option as keyof typeof updated.jobType] =
          !updated.jobType[option as keyof typeof updated.jobType];
      }
      return updated;
    });
  };

  const handleSalaryChange = (value: number) => {
    setFilters((prev) => ({
      ...prev,
      salary: value,
    }));
  };

  const handleReset = () => {
    setFilters(INITIAL_FILTERS);
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Overlay */}
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Filter Modal */}
        <View style={styles.filterModal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Filters</Text>
            <TouchableOpacity onPress={onClose}>
              <X color="#363535" size={24} />
            </TouchableOpacity>
          </View>

          {/* Filter Content */}
          <ScrollView 
            style={styles.content} 
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Location Section */}
            <View style={styles.filterSection}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() =>
                  setExpandedSection(
                    expandedSection === 'location' ? '' : 'location'
                  )
                }
              >
                <Text style={styles.sectionTitle}>Location</Text>
                <Text style={styles.expandIcon}>
                  {expandedSection === 'location' ? '▼' : '▶'}
                </Text>
              </TouchableOpacity>
              {expandedSection === 'location' && (
                <View style={styles.optionsContainer}>
                  <TouchableOpacity
                    style={styles.checkboxRow}
                    onPress={() =>
                      handleCheckboxChange('location', 'remote')
                    }
                  >
                    <View style={[styles.checkbox, filters.location.remote && styles.checkboxChecked]}>
                      {filters.location.remote && <Check size={16} color="#165DFC" />}
                    </View>
                    <Text style={styles.optionText}>Remote</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.checkboxRow}
                    onPress={() =>
                      handleCheckboxChange('location', 'thirupati')
                    }
                  >
                    <View style={[styles.checkbox, filters.location.thirupati && styles.checkboxChecked]}>
                      {filters.location.thirupati && <Check size={16} color="#165DFC" />}
                    </View>
                    <Text style={styles.optionText}>Thirupati</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Experience Section */}
            <View style={styles.filterSection}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() =>
                  setExpandedSection(
                    expandedSection === 'experience' ? '' : 'experience'
                  )
                }
              >
                <Text style={styles.sectionTitle}>Experience</Text>
                <Text style={styles.expandIcon}>
                  {expandedSection === 'experience' ? '▼' : '▶'}
                </Text>
              </TouchableOpacity>
              {expandedSection === 'experience' && (
                <View style={styles.optionsContainer}>
                  <TouchableOpacity
                    style={styles.checkboxRow}
                    onPress={() =>
                      handleCheckboxChange('experience', 'entryLevel')
                    }
                  >
                    <View style={[styles.checkbox, filters.experience.entryLevel && styles.checkboxChecked]}>
                      {filters.experience.entryLevel && <Check size={16} color="#165DFC" />}
                    </View>
                    <Text style={styles.optionText}>Entry Level</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.checkboxRow}
                    onPress={() =>
                      handleCheckboxChange('experience', 'midLevel')
                    }
                  >
                    <View style={[styles.checkbox, filters.experience.midLevel && styles.checkboxChecked]}>
                      {filters.experience.midLevel && <Check size={16} color="#165DFC" />}
                    </View>
                    <Text style={styles.optionText}>Mid Level</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Salary Section */}
            <View style={styles.filterSection}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() =>
                  setExpandedSection(
                    expandedSection === 'salary' ? '' : 'salary'
                  )
                }
              >
                <Text style={styles.sectionTitle}>Salary</Text>
                <Text style={styles.expandIcon}>
                  {expandedSection === 'salary' ? '▼' : '▶'}
                </Text>
              </TouchableOpacity>
              {expandedSection === 'salary' && (
                <View style={styles.optionsContainer}>
                  <Text style={styles.salaryLabel}>
                    ₹{filters.salary.toLocaleString()}
                  </Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={50000}
                    maximumValue={1000000}
                    step={10000}
                    value={filters.salary}
                    onValueChange={handleSalaryChange}
                    minimumTrackTintColor="#165DFC"
                    maximumTrackTintColor="#EAEBEE"
                  />
                  <View style={styles.salaryRange}>
                    <Text style={styles.rangeText}>₹50,000</Text>
                    <Text style={styles.rangeText}>₹10,00,000</Text>
                  </View>
                </View>
              )}
            </View>

            {/* Function Section */}
            <View style={styles.filterSection}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() =>
                  setExpandedSection(
                    expandedSection === 'function' ? '' : 'function'
                  )
                }
              >
                <Text style={styles.sectionTitle}>Function</Text>
                <Text style={styles.expandIcon}>
                  {expandedSection === 'function' ? '▼' : '▶'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Industry Section */}
            <View style={styles.filterSection}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() =>
                  setExpandedSection(
                    expandedSection === 'industry' ? '' : 'industry'
                  )
                }
              >
                <Text style={styles.sectionTitle}>Industry</Text>
                <Text style={styles.expandIcon}>
                  {expandedSection === 'industry' ? '▼' : '▶'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Job Type Section */}
            <View style={styles.filterSection}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() =>
                  setExpandedSection(
                    expandedSection === 'jobType' ? '' : 'jobType'
                  )
                }
              >
                <Text style={styles.sectionTitle}>Job Type</Text>
                <Text style={styles.expandIcon}>
                  {expandedSection === 'jobType' ? '▼' : '▶'}
                </Text>
              </TouchableOpacity>
              {expandedSection === 'jobType' && (
                <View style={styles.optionsContainer}>
                  <TouchableOpacity
                    style={styles.checkboxRow}
                    onPress={() =>
                      handleCheckboxChange('jobType', 'fullTime')
                    }
                  >
                    <View style={[styles.checkbox, filters.jobType.fullTime && styles.checkboxChecked]}>
                      {filters.jobType.fullTime && <Check size={16} color="#165DFC" />}
                    </View>
                    <Text style={styles.optionText}>Full Time</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.checkboxRow}
                    onPress={() =>
                      handleCheckboxChange('jobType', 'partTime')
                    }
                  >
                    <View style={[styles.checkbox, filters.jobType.partTime && styles.checkboxChecked]}>
                      {filters.jobType.partTime && <Check size={16} color="#165DFC" />}
                    </View>
                    <Text style={styles.optionText}>Part Time</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleReset}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApply}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  filterModal: {
    backgroundColor: '#FFFFFF',
    maxHeight: '95%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEBEE',
    minHeight: 60,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 300,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  filterSection: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEBEE',
    paddingBottom: 12,
    minHeight: 50,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    minHeight: 50,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
    flex: 1,
  },
  expandIcon: {
    fontSize: 14,
    color: '#797979',
    fontWeight: '600',
  },
  optionsContainer: {
    paddingLeft: 8,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginTop: 8,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    gap: 12,
    minHeight: 44,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#DBEAFF',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#DBEAFF',
    borderColor: '#165DFC',
  },
  optionText: {
    fontSize: 14,
    color: '#363535',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '500',
    flex: 1,
  },
  salaryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#165DFC',
    marginBottom: 12,
    marginTop: 8,
    fontFamily: 'Geist-VariableFont_wght',
  },
  slider: {
    width: '100%',
    height: 50,
    marginVertical: 16,
  },
  salaryRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  rangeText: {
    fontSize: 13,
    color: '#797979',
    fontFamily: 'Geist-VariableFont_wght',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 24,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#EAEBEE',
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: '#165DFC',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  resetButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#165DFC',
    fontFamily: 'Geist-VariableFont_wght',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#165DFC',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  applyButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Geist-VariableFont_wght',
  },
});
