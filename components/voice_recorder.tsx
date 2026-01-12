import { useReactMediaRecorder } from "react-media-recorder";
import { useState } from "react";

export const VoiceRecorder = ({ onUploadSuccess }: { onUploadSuccess: (data: any) => void }) => {
  const [isUploading, setIsUploading] = useState(false);

  const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({
    audio: true,
    blobPropertyBag: { type: "audio/wav" }, // Đảm bảo định dạng .wav như yêu cầu
    onStop: async (blobUrl, blob) => {
      await handleUpload(blob);
    }
  });

  const handleUpload = async (blob: Blob) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", blob, "recording.wav");

    try {
      // Gửi đến controller Backend (ai_draft_order_controller)
      const response = await fetch("/api/ai-assistant/draft-order", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      onUploadSuccess(data); // Truyền dữ liệu JSON trả về cho trang chính
    } catch (error) {
      console.error("Lỗi gửi file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed bottom-10 right-10 flex flex-col items-center">
      <p className="mb-2 text-sm">{status === "recording" ? "Đang ghi âm..." : "Nhấn để nói"}</p>
      <button
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        className={`p-4 rounded-full shadow-lg ${status === "recording" ? "bg-red-500" : "bg-blue-600"} text-white`}
      >
        {isUploading ? "..." : "🎤"}
      </button>
    </div>
  );
};