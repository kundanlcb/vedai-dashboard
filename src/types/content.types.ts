export interface ContentFile {
  id: string;
  fileName: string;
  fileType: 'pdf' | 'txt' | 'mp4' | 'mp3' | 'other';
  fileSize: number;
  uploadDate: string;
  uploadedBy: string;
  title: string;
  description: string;
  class: string;
  subject: string;
  chapter: string;
  topic: string;
  tags: string[];
  learningOutcomes: string[];
  status: 'draft' | 'under_review' | 'approved' | 'published' | 'archived';
  processingStatus: 'pending' | 'processing' | 'completed' | 'error';
  chunkCount: number;
  embeddingStatus: 'pending' | 'in_progress' | 'completed' | 'failed';
  publishDate?: string;
  reviewedBy?: string;
  reviewNotes?: string;
  errorMessages?: string[];
  lastUpdated: string;
}

export interface ContentFilters {
  subject?: string;
  chapter?: string;
  status?: string[];
  class?: string;
  createdDateRange?: {
    from: string;
    to: string;
  };
  updatedDateRange?: {
    from: string;
    to: string;
  };
  searchText?: string;
}

export interface ContentListResponse {
  data: ContentFile[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ContentUploadRequest {
  file: File;
  class: string;
  subject: string;
  chapter: string;
  topic: string;
  title: string;
  description: string;
  tags: string[];
  learningOutcomes: string[];
}

export interface ContentMetadata {
  title: string;
  description: string;
  class: string;
  subject: string;
  chapter: string;
  topic: string;
  tags: string[];
  learningOutcomes: string[];
}

