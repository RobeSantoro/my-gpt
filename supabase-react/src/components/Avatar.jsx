import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient.js'

export default function Avatar({ url, size, onUpload, thumbnail }) {
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (url) downloadImage(url)
  }, [url])

  async function downloadImage(path) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path)
      if (error) {
        throw error
      }
      const url = URL.createObjectURL(data)
      setAvatarUrl(url)
    } catch (error) {
      console.log('Error downloading image: ', error.message)
    }
  }

  async function uploadAvatar(event) {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      let { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      onUpload(event, filePath)
    } catch (error) {
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col place-items-center place-content-center" >

      {/* IMAGE */}
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="rounded-full avatar image"
          style={{ height: size, width: size }}
        />
      ) : (
        <div className="" style={{ height: size, width: size }} />
      )}

      {/* UPLOAD BUTTON */}

      {thumbnail ? (null) : (
        <>
          <label className="mx-2 btn btn-link" htmlFor="single">
            {uploading ? 'Uploading ...' : 'Cambia Foto'}
          </label>

          <input
            style={{
              visibility: 'hidden',
              position: 'absolute',
            }}
            type="file"
            id="single"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
          />
        </>
      )
      }




    </div>
  )
}