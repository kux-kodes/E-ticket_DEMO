import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xvvdlgohloeorprqnbbg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2dmRsZ29obG9lb3JwcnFuYmJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MjU5NjAsImV4cCI6MjA3MTEwMTk2MH0.OdcccS3eTk4RMSqNETbU9Zwg5slhl2lEsEU7ZeG3-jg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)