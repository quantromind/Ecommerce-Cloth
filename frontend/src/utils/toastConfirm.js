import { toast } from "react-hot-toast";

/**
 * Shows a confirmation toast.
 * @param {string} message - The message to display.
 * @param {function} onConfirm - Callback to execute if confirmed.
 * @param {function} onCancel - Optional callback if cancelled.
 */
export const showConfirmationToast = (message, onConfirm, onCancel) => {
    toast((t) => (
        <div className="flex flex-col gap-2 min-w-[250px]">
            <div className="text-sm font-medium text-gray-800 dark:text-text-main">
                {message}
            </div>
            <div className="flex gap-2 mt-2 justify-end">
                <button
                    onClick={() => {
                        toast.dismiss(t.id);
                        if (onCancel) onCancel();
                    }}
                    className="px-3 py-1 text-xs text-text-muted hover:text-gray-700 dark:text-text-muted dark:hover:text-text-main border border-gray-300 dark:border-gray-600 rounded"
                >
                    Cancel
                </button>
                <button
                    onClick={() => {
                        toast.dismiss(t.id);
                        onConfirm();
                    }}
                    className="px-3 py-1 text-xs bg-red-500 text-text-main rounded hover:bg-red-600 shadow-sm"
                >
                    Confirm
                </button>
            </div>
        </div>
    ), {
        duration: 8000, // Stay longer for interaction
        position: "top-center",
        style: {
            background: "#1a1a1a",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#fff",
        },
    });
};
