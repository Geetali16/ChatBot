import React, { useState, useEffect, useCallback } from "react";
import ReactFlow, {
  ReactFlowProvider,
  useStoreState,
  useStoreActions,
  useNodesState,
  useEdgesState,
  useNodes,
  useEdges,
  addEdge,
  Controls,
  MiniMap,
  Background,
  Handle,
  Position,
  updateEdge,
} from "reactflow";
import "reactflow/dist/style.css";
import "./Flow.css";
import { FaTrash } from "react-icons/fa";
import TextUpdaterNode from "./TextUpdaterNode";

const nodeTypes = { textUpdater: TextUpdaterNode };

const Flow = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [options, setOptions] = useState([]);
  const [formData, setFormData] = useState({});
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState();
  const [count, setCount] = useState(0);
  const [distx, setDistx] = useState(-100);
  let handleConnect;


  useEffect(() => {
    if (typeof formData !== "object") {
      console.log("printing formdata to check : ", formData);
      return;
    }
    
    if(count == 0) return;
    const newNodeId = `node-${nodes.length + 1}`;
    const newNode = {
      id: newNodeId,
      type: "textUpdater",
      data: {
        prompt: formData.prompt,
        label: formData.name,
        value: formData,
      },
      position: { x: distx, y: 100 },
      handleConnect,
      isConnectable: true,
    };
  
    const newNodes = [...nodes, newNode];
    setNodes(newNodes);
    // setNodes((prevNodes) => [...prevNodes, newNode]);

    // const newEdges = newNodes
    //   .map((node, index) => {
    //     if (index === 0) return null;
    //     return {
    //       id: `edge-${index}`,
    //       source: newNodes[index - 1].id,
    //       target: node.id,
    //     };
    //   })
    //   .filter((edge) => edge !== null);

    // setEdges(newEdges);

    setDistx((x) => (x + 50));
  }, [count]);


  const handleAddData = () => {
    console.log("formData:", formData);
    if (selectedOption === "send") {
      const { name, message } = formData;
      console.log("name:", name);
      console.log("message:", message);
      if (name && message) {
        const newData = {
          prompt: selectedOption,
          name,
          message,
        };
        console.log("newdata: ", newData);
        setFormData((prevFormData) => ({ ...prevFormData, ...newData }));
      }
    } else if (selectedOption === "ask") {
      const { responseType, name, question, reQuestion } = formData;
      if (name) {
        console.log("asking...");
        const newData = {
          prompt: selectedOption,
          responseType,
          name,
          question,
          reQuestion,
          options,
        };
        console.log(newData);
        setFormData((prevFormData) => ({ ...prevFormData, ...newData }));
      }
    }
    setCount((count) => count + 1);
  };

  const handleButtonClick = (option) => {
    setSelectedOption(option);
    setFormData((prevData) => ({
      ...prevData,
      prompt: option,
    }));
  };

  const handlePromptTypeChange = (option) => {
    setSelectedOption(option);
    setFormData((prevData) => ({
      ...prevData,
      prompt: option,
    }));
  };

  const handleAddOption = () => {
    if (options.length < 10) {

      setOptions([...options, ""]);
    } else {
      console.log("Maximum option limit reached");
    }
  };

  const handleDeleteOption = (index) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleMessageInputChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };



  const renderInputBox = () => {
    console.log(selectedOption);
    switch (selectedOption) {
      case "ask":
        return (
          <div className="input-box input-scroll">
            <h2 className="input-heading">Ask a question</h2>
            <div className="input-field">
              <label htmlFor="prompt">Prompt Type</label>
              <select
                id="prompt"
                value={formData.prompt}
                onChange={(e) => handlePromptTypeChange(e.target.value)}
              >
                <option value="send">Send a message</option>
                <option value="ask">Ask a question</option>
              </select>
            </div>

            <div className="input-field">
              <label htmlFor="responseType">Response Type</label>
              <select
                id="responseType"
                value={formData.responseType}
                onChange={(e) =>
                  handleMessageInputChange("responseType", e.target.value)
                }
              >
                <option value="opt">Options</option>
                <option value="text">Text</option>
                <option value="phone">Phone</option>
                <option value="email">Email</option>
                <option value="number">Number</option>
              </select>
            </div>

            <div className="input-field">
              <label htmlFor="name">Name*</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) =>
                  handleMessageInputChange("name", e.target.value)
                }
                placeholder="Enter name"
              />
            </div>

            <div className="input-field">
              <label htmlFor="question">Question*</label>
              <input
                type="text"
                id="question"
                value={formData.question}
                onChange={(e) =>
                  handleMessageInputChange("question", e.target.value)
                }
                placeholder="Enter your question"
              />
              <button>Add Variable</button>
            </div>

            <div className="input-field">
              <label htmlFor="reQuestion">Re-Question*</label>
              <input
                type="text"
                id="reQuestion"
                value={formData.reQuestion}
                onChange={(e) =>
                  handleMessageInputChange("reQuestion", e.target.value)
                }
                placeholder="Enter your question"
              />
              <span className="reques">
                Message to show if user input is invalid
              </span>
            </div>

            <div className="input-field">
              <label>
                <b>Options</b> (up to 10 options can be added)
              </label>
              {options.map((option, index) => (
                <div className="option-container" key={index}>
                  <input
                    type="text"
                    value={option}
                    placeholder="Type option"
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                  />
                  <FaTrash
                    className="delete-icon"
                    onClick={() => handleDeleteOption(index)}
                  />
                </div>
              ))}
              <button className="add-option" onClick={handleAddOption}>
                Add Option
              </button>
            </div>

            <div className="input-buttons">
              <button
                className="close-Button"
                onClick={() => handleButtonClick(null)}
              >
                Close
              </button>
              <button className="add-button" onClick={handleAddData}>
                Add
              </button>
            </div>
          </div>
        );
      case "send":
        return (
          <div className="input-box input-scroll">
            <h2 className="input-heading">Send a message</h2>

            <div className="input-field">
              <label htmlFor="prompt">Prompt Type</label>
              <select
                id="prompt"
                value={formData.prompt}
                onChange={(e) => handlePromptTypeChange(e.target.value)}
              >
                <option value="send">Send a message</option>
                <option value="ask">Ask a question</option>
              </select>
            </div>
            <div className="input-field">
              <label htmlFor="name">Name*</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                placeholder="Enter name"
                onChange={(e) =>
                  handleMessageInputChange("name", e.target.value)
                }
              />
            </div>
            <div className="input-field">
              <label htmlFor="message">Message*</label>
              <input
                type="text"
                id="message"
                value={formData.message}
                placeholder="Enter your message"
                onChange={(e) =>
                  handleMessageInputChange("message", e.target.value)
                }
              />
              <button>Add Variable</button>
            </div>
            <div className="input-buttons">
              <button
                className="close-Button"
                onClick={() => handleButtonClick(null)}
              >
                Close
              </button>
              <button className="add-button" onClick={handleAddData}>
                Add
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  handleConnect = useCallback(
    (sourceId, targetId) => {
      const newEdge = { id: `${sourceId}-${targetId}`, source: sourceId, target: targetId };
      setEdges((prevEdges) => [...prevEdges, newEdge]);
    },
    [setEdges]
  );

  const onConnect = useCallback(
    (connection) => {
      const { source, target } = connection;
      handleConnect(source, target);
    },
    [handleConnect]
  );

  return (
    <div className="providerflow" style={{ height: "100vh" }}>
      <ReactFlowProvider>
        <div
          className="reactflow-wrapper"
          style={{ width: "100vw", height: "100vh" }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            nodeTypes={nodeTypes}
          >
            <Background color="#888" variant="dots" size={1.5} />
            <Controls />
            <MiniMap pannable />
          </ReactFlow>
        </div>
        <div className="container">
          <button onClick={() => handleButtonClick("ask")}>
            Ask a Question
          </button>{" "}
          <br />
          <button onClick={() => handleButtonClick("send")}>
            Send a Message
          </button>
          {selectedOption !== null && selectedOption !== "" ? (
            renderInputBox())
            : (null)}
            
        </div>
      </ReactFlowProvider>
    </div>
  );
};

export default Flow;
