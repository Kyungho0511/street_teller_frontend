import { useContext, useState } from "react";
import { Survey, SurveyContext } from "../../context/SurveyContext";
import { Message, MessageContext } from "../../context/MessageContext";
import useEffectAfterMount from "../../hooks/useEffectAfterMount";
import { OpenAIResponseJSON } from "../../services/openai";
import { useLocation } from "react-router-dom";
import { parseString, pathToSection } from "../../utils/utils";
import { ClusterPrompt, ReportPrompt } from "../../constants/messageConstants";
import { RGBA } from "../../constants/mapConstants";
import CheckboxList, { CheckboxItem } from "./CheckboxList";
import { ReportSubList } from "../../constants/surveyConstants";

type CheckboxListAIProps = {
  surveyName: keyof Survey;
  list: CheckboxItem[];
  colors: RGBA[];
  prompt: ClusterPrompt | ReportPrompt | undefined;
  streamOpenAI: () => AsyncGenerator<string | OpenAIResponseJSON>;
  subList?: ReportSubList[];
};

/**
 * Checkbox list component to display the AI response.
 * @param surveyName Survey name of the checkbox list.
 * @param list List of AI reponses to be displayed after streaming.
 * @param colors List of colors to be applied to AI response.
 * @param prompt Prompts to ask to AI.
 * @param streamOpenAI Callback function to stream the OpenAI response.
 */
export default function CheckboxListAI({
  surveyName,
  list,
  colors,
  prompt,
  streamOpenAI,
  subList,
}: CheckboxListAIProps) {
  subList && console.log(subList);

  const { setSurvey } = useContext(SurveyContext);
  const { messages } = useContext(MessageContext);
  const {
    addMessage,
    isStreaming,
    setIsStreaming,
    errorMessage,
    setErrorMessage,
  } = useContext(MessageContext);

  const [streaming, setStreaming] = useState<CheckboxItem[]>([]);
  const listToDisplay = isStreaming.json && streaming ? streaming : list;

  const location = useLocation();
  const section = pathToSection(location.pathname);
  const run = messages[section].find(
    (message) => message.type === parseString(surveyName)
  )
    ? false
    : true;

  // Fetch and stream OpenAI response on setting prompts.
  useEffectAfterMount(() => {
    if (!prompt || !run) return;

    displayOpenAIResponse();
  }, [prompt]);

  // Update the list context whenever a new response is added.
  const responses: string[] = streaming
    .map((cluster) => cluster.content)
    .filter((reasoning) => reasoning !== "" && reasoning !== undefined);

  // Update the survey context when the new response is added.
  useEffectAfterMount(() => {
    setSurvey((prev) => ({
      ...prev,
      [surveyName]: { ...prev[surveyName], list: streaming },
    }));
  }, [responses.length]);

  /**
   * Start displaying the OpenAI streaming response.
   */
  const displayOpenAIResponse = async () => {
    // Reset the loading and error status.
    setIsStreaming((prev) => ({ ...prev, json: true }));
    setErrorMessage((prev) => ({ ...prev, json: "" }));

    let response: OpenAIResponseJSON = {
      labels: [{ name: "", reasoning: "" }],
    };
    let newList: CheckboxItem[] = [...list];

    try {
      // Start OpenAI JSON response streaming.
      for await (const chunk of streamOpenAI()) {
        response = chunk as OpenAIResponseJSON;

        // Update streaming with parsed data.
        newList = [...list];
        response?.labels?.forEach((item, i) => {
          newList[i] = {
            ...newList[i],
            name: item?.name,
            content: item?.reasoning,
            color: colors[i],
          };
        });
        setStreaming(newList);
      }
    } catch {
      const error = "Failed to fetch openAI JSON response.";
      setErrorMessage({ ...errorMessage, json: error });
      console.error(error);
    } finally {
      // Update the message context when the response is fully fetched.
      addMessage(section, {
        user: JSON.stringify(prompt!.content),
        ai: JSON.stringify(response),
        type: parseString(surveyName) as Message["type"],
      });
      setIsStreaming((prev) => ({ ...prev, json: false }));
      setSurvey((prev) => ({
        ...prev,
        [surveyName]: { ...prev[surveyName], list: newList },
      }));
    }
  };

  // Display error status of fetching openai response.
  if (errorMessage.json) {
    return <p>{errorMessage.json}</p>;
  }

  return (
    <CheckboxList
      surveyName={surveyName}
      list={listToDisplay}
      subList={subList}
    />
  );
}
