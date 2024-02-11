import { createClient } from "@supabase/supabase-js";


export const supabase= createClient(
    "https://zotmfrjbcizuwjxhqgnt.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvdG1mcmpiY2l6dXdqeGhxZ250Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc2MTYwMjIsImV4cCI6MjAyMzE5MjAyMn0.z9-gJ06y7HEA9z7gqPPRUJHh0qqnry5hK8F3LJksa9M"
    )