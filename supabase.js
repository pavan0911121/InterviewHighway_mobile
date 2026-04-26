import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://reybgptehrkxuqtjwbqp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJleWJncHRlaHJreHVxdGp3YnFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2ODc3MDcsImV4cCI6MjA4MzI2MzcwN30.bTaYi40r83Xy997y3w8VQdKrYPXYe1B2yadYR0NNsjA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;