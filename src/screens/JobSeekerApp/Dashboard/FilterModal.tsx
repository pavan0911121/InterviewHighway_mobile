import React, { useState, useMemo, useEffect } from 'react';
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
import { useSelector } from 'react-redux';

export interface Filters {
  location: Record<string, boolean>;
  experience: Record<string, boolean>;
  salary: number;
  jobType: Record<string, boolean>;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: Filters) => void;
  selectedLocations?: Record<string, boolean>;
  appliedFilters?: Filters;
}

export const INITIAL_FILTERS: Filters = {
  location: {},
  experience: {},
  salary: 0,
  jobType: {},
};

function formatLabel(str: string) {
  if (!str) return '';
  return str
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export default function FilterModal({ visible, onClose, onApply, selectedLocations, appliedFilters }: FilterModalProps) {
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const [expandedSection, setExpandedSection] = useState<string>('location');

  useEffect(() => {
    if (visible) {
      if (appliedFilters) {
        setFilters({ ...appliedFilters });
      } else if (selectedLocations) {
        setFilters((prev) => ({
          ...prev,
          location: { ...selectedLocations },
        }));
      }
    }
  }, [visible, appliedFilters, selectedLocations]);

  const handleCheckboxChange = (category: 'location' | 'experience' | 'jobType', option: string) => {
    setFilters((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [option]: !prev[category]?.[option],
      },
    }));
  };

  const selector = useSelector((state: any) => state.home);
  const jobsData = selector?.recommendedJobs?.jobs;

  const locationCounts = useMemo(() => {
    if (!Array.isArray(jobsData)) return {};
    const counts: Record<string, number> = {};
    jobsData.forEach((job: any) => {
      const loc = job?.location;
      if (loc && typeof loc === 'string') {
        const trimmed = loc.trim();
        if (trimmed) {
          counts[trimmed] = (counts[trimmed] || 0) + 1;
        }
      }
    });
    return counts;
  }, [jobsData]);

  const experienceCounts = useMemo(() => {
    if (!Array.isArray(jobsData)) return {};
    const counts: Record<string, number> = {};
    jobsData.forEach((job: any) => {
      const exp = job?.experience_level;
      if (exp && typeof exp === 'string') {
        const trimmed = exp.trim();
        if (trimmed) {
          counts[trimmed] = (counts[trimmed] || 0) + 1;
        }
      }
    });
    return counts;
  }, [jobsData]);

  const jobTypeCounts = useMemo(() => {
    if (!Array.isArray(jobsData)) return {};
    const counts: Record<string, number> = {};
    jobsData.forEach((job: any) => {
      const type = job?.employment_type;
      if (type && typeof type === 'string') {
        const trimmed = type.trim();
        if (trimmed) {
          counts[trimmed] = (counts[trimmed] || 0) + 1;
        }
      }
    });
    return counts;
  }, [jobsData]);

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
                  {Object.entries(locationCounts).map(([loc, count]) => {
                    const isChecked = !!filters.location[loc];
                    return (
                      <TouchableOpacity
                        key={loc}
                        style={styles.checkboxRow}
                        onPress={() => handleCheckboxChange('location', loc)}
                      >
                        <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                          {isChecked && <Check size={16} color="#165DFC" />}
                        </View>
                        <Text style={styles.optionText}>{`${loc} (${count})`}</Text>
                      </TouchableOpacity>
                    );
                  })}
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
                  {Object.entries(experienceCounts).map(([exp, count]) => {
                    const isChecked = !!filters.experience[exp];
                    return (
                      <TouchableOpacity
                        key={exp}
                        style={styles.checkboxRow}
                        onPress={() => handleCheckboxChange('experience', exp)}
                      >
                        <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                          {isChecked && <Check size={16} color="#165DFC" />}
                        </View>
                        <Text style={styles.optionText}>{`${formatLabel(exp)} (${count})`}</Text>
                      </TouchableOpacity>
                    );
                  })}
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
                    minimumValue={0}
                    maximumValue={1000000}
                    step={10000}
                    value={filters.salary}
                    onValueChange={handleSalaryChange}
                    minimumTrackTintColor="#165DFC"
                    maximumTrackTintColor="#EAEBEE"
                  />
                  <View style={styles.salaryRange}>
                    <Text style={styles.rangeText}>₹0</Text>
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
                  {Object.entries(jobTypeCounts).map(([type, count]) => {
                    const isChecked = !!filters.jobType[type];
                    return (
                      <TouchableOpacity
                        key={type}
                        style={styles.checkboxRow}
                        onPress={() => handleCheckboxChange('jobType', type)}
                      >
                        <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                          {isChecked && <Check size={16} color="#165DFC" />}
                        </View>
                        <Text style={styles.optionText}>{`${formatLabel(type)} (${count})`}</Text>
                      </TouchableOpacity>
                    );
                  })}
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
