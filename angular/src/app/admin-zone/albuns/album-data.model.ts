export interface AlbumData{
    albumId: number
    name: string
    path: string
    date: Date
    description: string
    imgUrl: string
    musicsUrls: string[]
    userRole: string
}

export interface FileData {    
    
    fileType: string
    fileName: string
    file: File
    
}