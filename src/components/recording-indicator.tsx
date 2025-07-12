import { Mic } from 'lucide-react';

const RecordingIndicator = () => {
    return (
        <div className="flex items-center text-sm font-medium text-red-600">
            <Mic className="w-4 h-4 mr-2 animate-blink" />
        </div>
    );
};

export default RecordingIndicator;