# Replace with your Anthropic API key
ANTHROPIC_API_KEY = "sk-ant-api03-sample-api-key"
from langchain.llms import Anthropic
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

# Initialize the Anthropic LLM
llm = Anthropic(
    anthropic_api_key=ANTHROPIC_API_KEY, model="claude-2"
)  # Or another model like "claude-3-sonnet-20240229" or "claude-2"
# Define the prompt template
prompt_template = PromptTemplate(
    input_variables=["context", "input"],
    template="""You are a helpful assistant. Use the following context to answer the user's question.
If you don't know the answer based on the context, simply say "I don't know."

Context:
{context}

Question: {input}

Answer:""",
)

# Create the LLM chain
chain = LLMChain(llm=llm, prompt=prompt_template)

# Example usage:
input_context = """
Langchain is a framework for developing applications powered by large language models (LLMs).
It provides tools for connecting LLMs to other sources of data and interacting with their environment.
Anthropic provides powerful LLMs like Claude which can be integrated with Langchain.
"""
user_input = "What is Langchain used for?"

# Run the chain with the context and input
response = chain.run({"context": input_context, "input": user_input})

# Print the response
print(response.strip())

# Another example:
input_context_2 = """
The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France.
It is named after the engineer Gustave Eiffel, whose company designed and built the tower.
The tower was erected in 1889 as the centerpiece of the 1889 World's Fair.
"""
user_input_2 = "When was the Eiffel Tower built?"

response_2 = chain.run({"context": input_context_2, "input": user_input_2})
print(response_2.strip())

# Example where the answer is not in the context:
input_context_3 = "The sky is blue and the grass is green."
user_input_3 = "What is the capital of Australia?"

response_3 = chain.run({"context": input_context_3, "input": user_input_3})
print(response_3.strip())
