# Jume Atlas Packer
The Jume Game Engine can load atlases created by this tool.

## How to use Jume Atlas
This tool uses a `toml` config file to generate an image atlas. You can run the executable directly inside a folder with a `atlas.toml` file without any arguments or provide a .toml file as an argument.

## The toml schema
The atlas config file can contain multiple configurations so you can generate multiple atlases at the same time.

Configs are in an [[atlas]] table array that holds the separate configs.  
The following config options are available:

- `name`: `String`. The name of the output files.
- `saveFolder`: `String`. The folder where the output will be saved.
- `folders`: `Array<String>`. folder paths containing images. This is not recursive so sub-folders will not be added. This is optional if you use the files field below.
- `files`: `Array<String>`. file paths of images. This is optional if you use the folders field above.
- `trimmed`: `Boolean`. If `true` the transparent space around the image will be trimmed. Optional. The default is true.
- `extrude`: `Integer`. The amount of pixels around the image to extrude. This can help with artifacts on the edges of sprites. Optional. The default is 1 pixel.
- `packMethod`: `String`.
  - `basic`: Sort the images alphabetically and add them to the atlas without optimization.
  - `optimal`: Pack the images in the smallest possible image.  
  Optional. The default is `optimal`. 
- `folderInName`: `Boolean`. If `true` the folder name will be added to the image name in the data file separated by an underscore(_). This can help if you have images with the same name in different folders in the same atlas. Optional. The default is false.
- `maxWidth`: `Integer`. The maximum width of the output image in pixels. Optional. The default is 4096.
- `maxHeight`: `Integer`. The maximum height of the output image in pixels. Optional. The default is 4096.
- `noData`: `Boolean`. If true only export the image without the json data file. Optional. The default is false.

The `saveFolder`, `files` and `folders` paths should be relative to the config file.   
This is an example of a config file:
``` toml
[[atlas]]
name = "basic"
saveFolder = "output/01_basic"
folders = [
  "images",
  "otherImages/pictures"
]
files = [
  "myFile.png",
  "myImageFolder/myImage.png"
]
trimmed = false
extrude = 1
packMethod = "basic"
folderInName = true
maxWidth = 1024
maxHeight = 1024
noData = false
```

## The output data json file
The data file for the atlas has the same format as the basic json export in texturepacker so it is easy to integrate with other software that reads image atlases.  
This is an example of the output file:

``` json
{
  "frames": [
    {
      "rotated": false,
      "sourceSize": {
        "h": 46,
        "w": 48
      },
      "filename": "blue_box",
      "spriteSourceSize": {
        "h": 46,
        "w": 48,
        "x": 0,
        "y": 0
      },
      "frame": {
        "h": 46,
        "w": 48,
        "x": 0,
        "y": 0
      },
      "trimmed": false
    }
  ]
}
```