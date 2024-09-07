/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_ANON_KEY: string;
    
    readonly VITE_GOOGLE_BOOKS_API_KEY: string;
    readonly VITE_OPENAI_API_KEY: string;

    readonly TEST_USERNAME: string;
    readonly TEST_PASSWORD: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  