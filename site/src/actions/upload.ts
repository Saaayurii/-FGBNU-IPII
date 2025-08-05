"use server";

import { validateFile, generateFileName, optimizeImage, saveFile, deleteFile } from "@/lib/upload";

export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    
    if (!file) {
      return { success: false, error: "$09; =5 =0945=" };
    }

    // 0;840F8O D09;0
    await validateFile(file, 'images');

    // 5=5@8@C5< 8<O D09;0
    const fileName = await generateFileName(file.name);

    // >;CG05< buffer D09;0
    const arrayBuffer = await file.arrayBuffer();

    // ?B8<878@C5< 87>1@065=85
    const optimizedBuffer = await optimizeImage(arrayBuffer, 'images');

    // !>E@0=O5< D09;
    const filePath = await saveFile(optimizedBuffer, fileName, 'images');

    return {
      success: true,
      data: {
        fileName,
        filePath,
        originalName: file.name,
        size: optimizedBuffer.length,
        type: file.type
      }
    };
  } catch (error) {
    console.error("H81:0 703@C7:8 87>1@065=8O:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "H81:0 ?@8 703@C7:5 D09;0"
    };
  }
}

export async function uploadSliderImage(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    
    if (!file) {
      return { success: false, error: "$09; =5 =0945=" };
    }

    // 0;840F8O D09;0
    await validateFile(file, 'slider');

    // 5=5@8@C5< 8<O D09;0
    const fileName = await generateFileName(file.name);

    // >;CG05< buffer D09;0
    const arrayBuffer = await file.arrayBuffer();

    // ?B8<878@C5< 87>1@065=85
    const optimizedBuffer = await optimizeImage(arrayBuffer, 'slider');

    // !>E@0=O5< D09;
    const filePath = await saveFile(optimizedBuffer, fileName, 'slider');

    return {
      success: true,
      data: {
        fileName,
        filePath,
        originalName: file.name,
        size: optimizedBuffer.length,
        type: file.type
      }
    };
  } catch (error) {
    console.error("H81:0 703@C7:8 87>1@065=8O 4;O A;0945@0:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "H81:0 ?@8 703@C7:5 D09;0"
    };
  }
}

export async function deleteUploadedFile(filePath: string) {
  try {
    const deleted = await deleteFile(filePath);
    
    if (deleted) {
      return { success: true };
    } else {
      return { success: false, error: "5 C40;>AL C40;8BL D09;" };
    }
  } catch (error) {
    console.error("H81:0 C40;5=8O D09;0:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "H81:0 ?@8 C40;5=88 D09;0"
    };
  }
}

export async function uploadMultipleImages(formData: FormData) {
  try {
    const files = formData.getAll('files') as File[];
    
    if (!files || files.length === 0) {
      return { success: false, error: "$09;K =5 =0945=K" };
    }

    const results = [];
    const errors = [];

    for (const file of files) {
      try {
        // 0;840F8O D09;0
        await validateFile(file, 'images');

        // 5=5@8@C5< 8<O D09;0
        const fileName = await generateFileName(file.name);

        // >;CG05< buffer D09;0
        const arrayBuffer = await file.arrayBuffer();

        // ?B8<878@C5< 87>1@065=85
        const optimizedBuffer = await optimizeImage(arrayBuffer, 'images');

        // !>E@0=O5< D09;
        const filePath = await saveFile(optimizedBuffer, fileName, 'images');

        results.push({
          fileName,
          filePath,
          originalName: file.name,
          size: optimizedBuffer.length,
          type: file.type
        });
      } catch (fileError) {
        errors.push({
          fileName: file.name,
          error: fileError instanceof Error ? fileError.message : "58725AB=0O >H81:0"
        });
      }
    }

    return {
      success: true,
      data: {
        uploaded: results,
        errors: errors,
        totalUploaded: results.length,
        totalErrors: errors.length
      }
    };
  } catch (error) {
    console.error("H81:0 <0AA>2>9 703@C7:8 87>1@065=89:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "H81:0 ?@8 703@C7:5 D09;>2"
    };
  }
}