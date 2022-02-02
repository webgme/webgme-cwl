{
    "cwlVersion": "v1.1",
    "class": "Workflow",
    "inputs":
    {
        "js_source": "File"
    },
    "outputs":
    {
        "js_output":{
            "type": "File",
            "outputSource": "two/st_out"
        }
    },
    "steps": {
        "one": {
            "run":"docker-js.cwl",
            "in": {
                "text": "two/st_out",
                "src": "js_source"
            },
            "out": ["st_out"]
        },
        "two": {
            "run":"docker-js.cwl",
            "in":{
                "src": "js_source",
                "text": "one/st_out"
            },
            "out": ["st_out"]
        }
    }
}