import { useContext, useEffect, useState } from "react";
import { Prompt } from "../../constants/messageConstants";
import { MessageContext } from "../../context/MessageContext";
import { streamOpenAI } from "../../services/openai";

export default function AiResponseJSON() {
  const { promptJson, updatePromptJson } = useContext(MessageContext); 
  const [parsedData, setParsedData] = useState<string>("");

  // Send added text prompt to openAI and render the response.
  useEffect(() => {
    if (promptJson) {
      // Proceed typing animation for the text prompt
      startTypingAnimation({ type: "cluster", content: promptJson });
    }
  }, [promptJson]);

  async function startTypingAnimation(prompt: Prompt): Promise<void> {
    try {
      // play typing animation while fetching response
      for await (const parsedObject of streamOpenAI(prompt)) {
        console.log(parsedObject);
      }

    // // When the response is fully fetched, update states.
    // // Update the clusterList in the survey context
    // const updatedList = survey.clusterLists[clusterIndex].list.map(
    //   (item, i) => ({
    //     ...item,
    //     name: data.clusters[i].name,
    //     reasoning: data.clusters[i].reasoning,
    //   })
    // );
    // const newCluster: ClusterList = {
    //   name: clusterName as "cluster1" | "cluster2" | "cluster3",
    //   list: updatedList,
    // };
    // setSurveyContext(newCluster);

      setParsedData("");
    } catch (error) {
      console.error("Failed to fetch openAI response:", error);
    }
  }

  return <>{"asd"}</>;
}
