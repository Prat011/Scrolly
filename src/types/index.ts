export interface Message {
    role: 'user' | 'assistant'
    content: string
  }
  
  export interface PdfDocument {
    id: string
    title: string
    currentPage: number
    totalPages: number
  }