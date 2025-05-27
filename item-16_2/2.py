from langchain.chains import LLMChain
from langchain_anthropic import ChatAnthropic
from langchain.prompts import PromptTemplate

ANTHROPIC_API_KEY = "sk-ant-api03-sample-api-key"

# Initialize the Anthropic model
llm = ChatAnthropic(
    model="claude-3-7-sonnet-20250219", anthropic_api_key=ANTHROPIC_API_KEY
)

# Create a prompt template
prompt = PromptTemplate(
    input_variables=["context", "question"],
    template="""
    You are a helpful AI assistant. Use the following context to answer the question.
    
    Context: {context}
    
    Question: {question}
    
    Answer:""",
)

# Create a chain
chain = llm | prompt


# Example usage
from langchain.schema import HumanMessage, SystemMessage


def get_response(context, question):
    return chain.invoke(
        [SystemMessage(content=context), HumanMessage(content=question)]
    )


# Sample execution
if __name__ == "__main__":
    context = "Python is a high-level, interpreted programming language created by Guido van Rossum in 1991."
    question = "When was Python created and by whom?"

    response = get_response(context, question)
    print(response)
