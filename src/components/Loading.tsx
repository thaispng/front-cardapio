import { Loader2 } from "lucide-react";

const Loading = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-background text-foreground backdrop-blur-md z-50">
            <Loader2 className="w-12 h-12 animate-spin" />
        </div>
    );
};

export default Loading;
