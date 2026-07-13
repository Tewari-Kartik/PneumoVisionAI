import gradio as gr
from main import app as fastapi_app

# Create a dummy Gradio UI just to satisfy Hugging Face's SDK requirement
demo = gr.Blocks()
with demo:
    gr.Markdown("# PneumoVision API Backend\nYour FastAPI server is running successfully!")

# This secretly runs our full FastAPI app at the root URL!
app = gr.mount_gradio_app(fastapi_app, demo, path="/ui")
