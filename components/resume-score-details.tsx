import { CheckCircleIcon, XCircleIcon } from "lucide-react"

export function ResumeScoreDetails() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Strengths</h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
            <span>Strong technical skills section with relevant keywords</span>
          </li>
          <li className="flex items-start">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
            <span>Clear and concise project descriptions</span>
          </li>
          <li className="flex items-start">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
            <span>Quantifiable achievements in experience section</span>
          </li>
          <li className="flex items-start">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
            <span>Well-structured education section</span>
          </li>
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Areas for Improvement</h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <XCircleIcon className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            <div>
              <span>Missing industry-specific keywords</span>
              <p className="text-sm text-muted-foreground mt-1">
                Add more keywords related to your target roles to improve ATS matching.
              </p>
            </div>
          </li>
          <li className="flex items-start">
            <XCircleIcon className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            <div>
              <span>Resume is slightly too long (2.5 pages)</span>
              <p className="text-sm text-muted-foreground mt-1">
                Consider condensing to 1-2 pages for better readability.
              </p>
            </div>
          </li>
          <li className="flex items-start">
            <XCircleIcon className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            <div>
              <span>Inconsistent formatting in bullet points</span>
              <p className="text-sm text-muted-foreground mt-1">
                Ensure all bullet points follow the same structure and tense.
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}

