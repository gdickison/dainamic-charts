
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yraqwkkhjjyoufmctbaf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyYXF3a2toamp5b3VmbWN0YmFmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4NDE3NzQ1MiwiZXhwIjoxOTk5NzUzNDUyfQ.2pKgSkR2MLlp9ufiVlcBb085udWKzTAGt1I2YZkup-c'
export const supabase = createClient(supabaseUrl, supabaseKey)