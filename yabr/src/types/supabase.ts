export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      books: {
        Row: {
          access_view_status: string | null
          allow_anon_logging: boolean | null
          authors: string[] | null
          canonical_volume_link: string | null
          categories: string[] | null
          contains_epub_bubbles: boolean | null
          contains_image_bubbles: boolean | null
          content_version: string | null
          country: string | null
          created_at: string | null
          description: string | null
          embeddable: boolean | null
          epub_available: boolean | null
          etag: string | null
          extra_large_image: string | null
          google_books_id: string | null
          height: string | null
          id: string
          image_readable: boolean | null
          info_link: string | null
          is_ebook: boolean | null
          isbn_10: string | null
          isbn_13: string | null
          language: string | null
          large_image: string | null
          maturity_rating: string | null
          medium_image: string | null
          page_count: number | null
          pdf_available: boolean | null
          preview_link: string | null
          print_type: string | null
          printed_page_count: number | null
          public_domain: boolean | null
          published_date: string | null
          publisher: string | null
          quote_sharing_allowed: boolean | null
          saleability: string | null
          self_link: string | null
          small_image: string | null
          small_thumbnail: string | null
          text_readable: boolean | null
          text_to_speech_permission: string | null
          thickness: string | null
          thumbnail: string | null
          title: string
          updated_at: string | null
          viewability: string | null
          web_reader_link: string | null
          width: string | null
        }
        Insert: {
          access_view_status?: string | null
          allow_anon_logging?: boolean | null
          authors?: string[] | null
          canonical_volume_link?: string | null
          categories?: string[] | null
          contains_epub_bubbles?: boolean | null
          contains_image_bubbles?: boolean | null
          content_version?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          embeddable?: boolean | null
          epub_available?: boolean | null
          etag?: string | null
          extra_large_image?: string | null
          google_books_id?: string | null
          height?: string | null
          id?: string
          image_readable?: boolean | null
          info_link?: string | null
          is_ebook?: boolean | null
          isbn_10?: string | null
          isbn_13?: string | null
          language?: string | null
          large_image?: string | null
          maturity_rating?: string | null
          medium_image?: string | null
          page_count?: number | null
          pdf_available?: boolean | null
          preview_link?: string | null
          print_type?: string | null
          printed_page_count?: number | null
          public_domain?: boolean | null
          published_date?: string | null
          publisher?: string | null
          quote_sharing_allowed?: boolean | null
          saleability?: string | null
          self_link?: string | null
          small_image?: string | null
          small_thumbnail?: string | null
          text_readable?: boolean | null
          text_to_speech_permission?: string | null
          thickness?: string | null
          thumbnail?: string | null
          title: string
          updated_at?: string | null
          viewability?: string | null
          web_reader_link?: string | null
          width?: string | null
        }
        Update: {
          access_view_status?: string | null
          allow_anon_logging?: boolean | null
          authors?: string[] | null
          canonical_volume_link?: string | null
          categories?: string[] | null
          contains_epub_bubbles?: boolean | null
          contains_image_bubbles?: boolean | null
          content_version?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          embeddable?: boolean | null
          epub_available?: boolean | null
          etag?: string | null
          extra_large_image?: string | null
          google_books_id?: string | null
          height?: string | null
          id?: string
          image_readable?: boolean | null
          info_link?: string | null
          is_ebook?: boolean | null
          isbn_10?: string | null
          isbn_13?: string | null
          language?: string | null
          large_image?: string | null
          maturity_rating?: string | null
          medium_image?: string | null
          page_count?: number | null
          pdf_available?: boolean | null
          preview_link?: string | null
          print_type?: string | null
          printed_page_count?: number | null
          public_domain?: boolean | null
          published_date?: string | null
          publisher?: string | null
          quote_sharing_allowed?: boolean | null
          saleability?: string | null
          self_link?: string | null
          small_image?: string | null
          small_thumbnail?: string | null
          text_readable?: boolean | null
          text_to_speech_permission?: string | null
          thickness?: string | null
          thumbnail?: string | null
          title?: string
          updated_at?: string | null
          viewability?: string | null
          web_reader_link?: string | null
          width?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          book_id: string | null
          created_at: string | null
          id: string
          rating: number | null
          review_text: string
          user_id: string | null
        }
        Insert: {
          book_id?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          review_text: string
          user_id?: string | null
        }
        Update: {
          book_id?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          review_text?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books_with_ratings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      books_with_ratings: {
        Row: {
          access_view_status: string | null
          allow_anon_logging: boolean | null
          authors: string[] | null
          average_rating: number | null
          canonical_volume_link: string | null
          categories: string[] | null
          contains_epub_bubbles: boolean | null
          contains_image_bubbles: boolean | null
          content_version: string | null
          country: string | null
          created_at: string | null
          description: string | null
          embeddable: boolean | null
          epub_available: boolean | null
          etag: string | null
          extra_large_image: string | null
          google_books_id: string | null
          height: string | null
          id: string | null
          image_readable: boolean | null
          info_link: string | null
          is_ebook: boolean | null
          isbn_10: string | null
          isbn_13: string | null
          language: string | null
          large_image: string | null
          maturity_rating: string | null
          medium_image: string | null
          page_count: number | null
          pdf_available: boolean | null
          preview_link: string | null
          print_type: string | null
          printed_page_count: number | null
          public_domain: boolean | null
          published_date: string | null
          publisher: string | null
          quote_sharing_allowed: boolean | null
          review_count: number | null
          saleability: string | null
          self_link: string | null
          small_image: string | null
          small_thumbnail: string | null
          text_readable: boolean | null
          text_to_speech_permission: string | null
          thickness: string | null
          thumbnail: string | null
          title: string | null
          updated_at: string | null
          viewability: string | null
          web_reader_link: string | null
          width: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
