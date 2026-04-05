export type Product = {
  name: string;
  desc?: string;
  price: number;
  stock?: number;
  userId: number;
};

export type ProductQuery = {
  
  userId?: string;
  q?: string;
  page: number;
  limit: number;
};
// userId - lọc products theo user, không bắt buộc

// q - tìm kiếm gần đúng theo name, không bắt buộc

// page - trang hiện tại, mặc định 1

// limit - số items mỗi trang, mặc định 10, tối đa 50
