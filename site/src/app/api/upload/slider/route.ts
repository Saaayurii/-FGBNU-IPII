import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadSliderImage } from '@/actions/upload';


type UploadResponse =
  | { success: false; error: string }
  | { success: true; data: { fileName: string; filePath: string; originalName: string; size: number; type: string } };

export const POST = (request: NextRequest) =>
  getServerSession(authOptions)
    .then(session =>
      !session || !session.user || (session.user as any).role !== 'ADMIN'
        ? Promise.resolve(
            NextResponse.json<UploadResponse>(
              { success: false, error: 'Доступ запрещён' },
              { status: 401 }
            )
          )
        : request
            .formData()
            .then(formData => uploadSliderImage(formData))
            .then(result =>
              result.success === true
                ? NextResponse.json<UploadResponse>(
                    {
                      success: true,
                      data: result.data!,
                    },
                    { status: 200 }
                  )
                : NextResponse.json<UploadResponse>(
                    {
                      success: false,
                      error: result.error || 'Ошибка загрузки',
                    },
                    { status: 400 }
                  )
            )
    )
    .catch(error => {
      console.error('Ошибка API:', error);
      return NextResponse.json<UploadResponse>(
        { success: false, error: 'Внутренняя ошибка сервера' },
        { status: 500 }
      );
    });



export const GET = () =>
  Promise.resolve(
    NextResponse.json(
      { message: 'Upload Slider Image API endpoint' },
      { status: 200 }
    )
  );
