import axios from "axios";

// ============================================================
// MEDIA
// ============================================================

// export async function deleteMediaFilesByKey(fileKeys: string[]) {
//   try {
//     const response = await axios.delete('/api/media/deleteFiles', {
//       data: { fileKeys },
//     });
//     console.log(response);
//     return response;
//   } catch (error) {
//     console.error(error);
//   }
// }

export function deleteMediaFilesByKey(fileKeys: string[]): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.delete('/api/media/deleteFiles', {
                data: { fileKeys },
            });
            console.log(response);
            resolve(response);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}
