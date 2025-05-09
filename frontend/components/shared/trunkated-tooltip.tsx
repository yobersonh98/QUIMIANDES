import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Componente que trunca texto y muestra el texto completo en un tooltip
export const TruncatedTextWithTooltip = ({ text, maxLength = 30 }: {text?:string, maxLength?:number}) => {
  const needsTruncation = text && text.length > maxLength;
  const displayText = needsTruncation ? `${text.substring(0, maxLength)}...` : text;

  if (!text) return <span>-</span>;

  return needsTruncation ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-help">{displayText}</span>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm bg-white p-2 rounded shadow text-gray-800 border border-gray-200">
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <span>{displayText}</span>
  );
};