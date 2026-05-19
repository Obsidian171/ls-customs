/**
 * Модуль интеграции с ImgBB API для загрузки изображений
 */

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || '1df5771fa1171fa37c2188ecbce9600e'

/**
 * Загружает файл изображения на ImgBB и возвращает прямую ссылку на картинку CDN
 * @param file Выбранный файл изображения
 */
export const uploadToImgBB = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('image', file)

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
    method: 'POST',
    body: formData
  })

  if (!response.ok) {
    const errText = await response.text()
    console.error('ImgBB error response:', errText)
    throw new Error('Не удалось загрузить изображение на хостинг ImgBB')
  }

  const result = await response.json()
  if (result && result.data && result.data.url) {
    return result.data.url
  }

  throw new Error('ImgBB вернул пустой или некорректный ответ')
}
