const supabase = require('../config/db')
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

const bookModel = {

    uploadImage: async (fileBuffer, originalName, mimeType) => {
        try {
            const ext = originalName.split('.').pop()
            const uniqueName = `${Date.now()}-${crypto.randomUUID()}.${ext}`

            const { data, error } = await supabase.storage
                .from('book-images')
                .upload(uniqueName, fileBuffer, {
                    contentType: mimeType,
                    cacheControl: '3600',
                    upsert: false
                })

            if (error) {
                console.error('Lỗi upload ảnh lên Supabase:', error)
                return null
            }

            const { data: publicUrlData } = supabase.storage
                .from('book-images')
                .getPublicUrl(uniqueName)

            console.log('Upload ảnh thành công:', publicUrlData.publicUrl)
            return publicUrlData.publicUrl

        } catch (error) {
            console.error('Lỗi upload ảnh:', error)
            throw error
        }
    },

    create: async (bookData, file) => {
        try {
            let imageUrl = null
            if (file) {
                imageUrl = await bookModel.uploadImage(
                    file.buffer,
                    file.originalname,
                    file.mimetype
                )
                if (!imageUrl) {
                    console.error('Không thể upload ảnh, hủy tạo sách')
                    return null
                }
            }

            const { title, author, price, description, genre } = bookData

            const { data: book, error } = await supabase
                .from('books')
                .insert([
                    {
                        title,
                        author,
                        price: parseFloat(price),
                        description,
                        image_url: imageUrl,
                        genre
                    }
                ])
                .select()
                .single()

            if (error) {
                console.error('Lỗi tạo sách:', error)
                return null
            }

            console.log('Sách đã được tạo:', book)
            return book

        } catch (error) {
            console.error('Lỗi tạo sách:', error)
            throw error
        }
    },

    getAll: async () => {
        try {
            const { data: books, error } = await supabase
                .from('books')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Lỗi lấy danh sách sách:', error)
                return null
            }

            return books

        } catch (error) {
            console.error('Lỗi lấy danh sách sách:', error)
            throw error
        }
    },

    getById: async (id) => {
        try {
            const { data: book, error } = await supabase
                .from('books')
                .select('*')
                .eq('id', id)
                .single()

            if (error) {
                console.error('Lỗi lấy sách:', error)
                return null
            }

            return book

        } catch (error) {
            console.error('Lỗi lấy sách:', error)
            throw error
        }
    },

    delete: async (id) => {
        try {
            const { data, error } = await supabase
                .from('books')
                .delete()
                .eq('id', id)
                .select()

            if (error) {
                console.error('Lỗi xóa sách:', error)
                return null
            }

            console.log('Sách đã được xóa:', data)
            return data

        } catch (error) {
            console.error('Lỗi xóa sách:', error)
            throw error
        }
    },

    update: async (id, bookData, file) => {
        try {
            let updatedBookData = { ...bookData };

            if (file) {
                const newImageUrl = await bookModel.uploadImage(
                    file.buffer,
                    file.originalname,
                    file.mimetype
                );

                if (!newImageUrl) {
                    console.error('Không thể upload ảnh mới, hủy cập nhật sách');
                    return null;
                }

                updatedBookData.image_url = newImageUrl;
            }

            if (updatedBookData.price) {
                updatedBookData.price = parseFloat(updatedBookData.price);
            }

            const { data, error } = await supabase
                .from('books')
                .update(updatedBookData)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error('Lỗi cập nhật sách:', error)
                return null
            }

            console.log('Sách đã được cập nhật thành công:', data)
            return data

        } catch (error) {
            console.error('Lỗi cập nhật sách:', error)
            throw error
        }
    }
}

module.exports = bookModel

// bookModel.update(
//     1,
//     {
//         title: "thiên sứ nhà bên",
//         author: "Paulo Coelho",
//         price: "79000",
//         description: "Một cuốn sách hay về việc theo đuổi ước mơ.",
//         genre: "Sách Nước Ngoài"
//     },
//     {
//         originalname: "thien_su_nha_ben.webp",    
//         mimetype: "image/webp",    
//         buffer: fs.readFileSync('./src/tests/uploads/thien_su_nha_ben.webp')    
//     }
// )
// bookModel.create(
//     {
//         title: "Nhà Giả Kim",
//         author: "Paulo Coelho",
//         price: "79000",
//         description: "Một cuốn sách hay về việc theo đuổi ước mơ.",
//         genre: "Sách Nước Ngoài"
//     }, 
//     {
//         originalname: "nha_gia_kim.webp",
//         mimetype: "image/webp",
//         buffer: fs.readFileSync('./src/tests/uploads/nha_gia_kim.webp')
//     }
// )
// .then(result => console.log("Kết quả:", result))
// .catch(err => console.error("Lỗi:", err))