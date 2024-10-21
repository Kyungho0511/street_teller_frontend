import styles from "./CheckboxList.module.css";
import { Cluster, ClusterCheckboxItem, ClusterList } from "../../constants/surveyConstants";
import Colorbox from "../atoms/Colorbox";
import { useContext, useState } from "react";
import Button from "../atoms/Button";
import { SurveyContext } from "../../context/SurveyContext";
import { MessageContext } from "../../context/MessageContext";
import { KMeansLayer } from "../../services/kmeans";
import useEffectAfterMount from "../../hooks/useEffectAfterMount";
import { OpenAiResponseJSON, streamOpenAI } from "../../services/openai";

type CheckboxListAIProps = {
  name: string;
  list: ClusterCheckboxItem[];
  index: number;
  kMeansLayers: KMeansLayer[];
};

/**
 * Checkbox list component to display the AI response.
 */
export default function CheckboxListAI({ name, list, index, kMeansLayers }: CheckboxListAIProps) {

  // Global states
  const { survey, setSurveyContext } = useContext(SurveyContext);
  const {
    messages,
    addMessage,
    loadingMessage,
    setLoadingMessage,
    errorMessage,
    setErrorMessage,
  } = useContext(MessageContext);

  // Local states
  const [streaming, setStreaming] = useState<ClusterCheckboxItem[]>([]);
  const listToDisplay = loadingMessage.json && streaming ? streaming : list;

  // Fetch and display OpenAI reasoning on setting kMeansLayer.
  useEffectAfterMount(() => {
    startTypingAnimation();
  }, [kMeansLayers]);

  // Update the cluster list context whenever a new cluster is added.
  const reasonings: string[] = streaming
    .map((cluster) => cluster.reasoning)
    .filter((reasoning) => reasoning !== "" && reasoning !== undefined);

  useEffectAfterMount(() => {
    setSurveyContext({ name, list: streaming } as ClusterList);
  }, [reasonings.length]);

  /**
   * Start the typing animation for the OpenAI streaming response.
   */
  const startTypingAnimation = async () => {

    // Reset the loading and error status.
    setLoadingMessage((prev) => ({ ...prev, json: true }));
    setErrorMessage((prev) => ({...prev, json: undefined}));

    // Construct prompt JSON for OpenAI.
    const promptJson: Cluster[] = list.map(
      (_, i) =>
        ({
          name: "",
          centroids: kMeansLayers[index]?.attributes.map((attr, j) => ({
            name: attr,
            value: kMeansLayers[index]?.centroids[i][j],
          })),
        } as Cluster)
    );
    
    let response: OpenAiResponseJSON = {
      clusters: [{ name: "", reasoning: "" }],
    };
    let newList: ClusterCheckboxItem[] = [...list];

    try {
      // Start OpenAI JSON response streaming.
      for await (const chunk of streamOpenAI(
        { type: "cluster", content: promptJson },
        messages,
        survey.preferenceList.list,
        index
      )) {
        response = chunk as OpenAiResponseJSON;

        // Update streaming with parsed data.
        newList = [...list];
        response?.clusters?.forEach((cluster, i) => {
          newList[i] = {
            ...newList[i],
            name: cluster?.name,
            reasoning: cluster?.reasoning,
            centroids: kMeansLayers[index]!.attributes.map(
              (attr, j) => ({
                name: attr,
                value: kMeansLayers[index]!.centroids[i][j],
              })
            ),
            color: kMeansLayers[index]!.colors[i],
          };
        });
        setStreaming(newList);
      }
    } catch {
      const error = "Failed to fetch openAI JSON response.";
      setErrorMessage(({...errorMessage, json: error}));
      console.error(error);
    } finally {
      // Update the message context when the response is fully fetched.
      addMessage({
        user: JSON.stringify(promptJson),
        ai: JSON.stringify(response),
        type: "cluster",
      });
      setLoadingMessage((prev) => ({ ...prev, json: false }));
      setSurveyContext({ name, list: newList } as ClusterList);
    }
  };

  // Handle uncontrolled checkbox change
  const handleListChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedList = [...list];
    updatedList[index] = {
      ...updatedList[index],
      checked: event.target.checked,
    };

    setSurveyContext({
      name: name as ClusterList["name"],
      list: updatedList as ClusterCheckboxItem[],
    });
  };

  // Display error status of fetching openai response.
  if (errorMessage.json) {
    return <p>{errorMessage.json}</p>
  }

  return (
    <>
      <ul className={styles.list}>
        {listToDisplay.map((item, index) => (
          <li key={item.id}>
            <label className={styles.label}>
              <input
                className={styles.input}
                type="checkbox"
                name={name}
                value={item.name}
                checked={item.checked}
                onChange={(event) => handleListChange(event, index)}
              />
              <span className={styles.indicator}></span>
              <Colorbox
                label={item.name}
                color={item.color}
                fontSize={"1rem"}
              />
            </label>
            <div className={styles.text}>{item.reasoning}</div>
          </li>
        ))}
      </ul>

      <Button
        text={"retry analysis"}
        location={"sidebar"}
        handleClick={startTypingAnimation}
      />
    </>
  );
}