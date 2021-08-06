This extension adds or modifies existing touchpad gestures on GNOME.
### Supported Versions
* GNOME Shell 40

## Installation
### From GNOME extensions website 
[extension#4245](https://extensions.gnome.org/extension/4245/gesture-improvements/).
### From git repo.
* Install extension.
```
git clone https://github.com/harshadgavali/gnome-gesture-improvements.git/
cd gnome-gesture-improvements
npm install
npm run update
```
* Log out and log back in OR just restart.
* Enable extension via extensions app or via command line
```
gnome-extensions enable gestureImprovements@gestures
```

## Gestures available (including built-in ones)
| Gesture                                     | Modes    | Fingers | Direction       |
| :------------------------------------------ | :------- | :------ | :-------------- |
| Switch windows                              | Desktop  | 3       | Horizontal      |
| Switch workspaces                           | Overview | 2/3     | Horizontal      |
| Switch app pages                            | AppGrid  | 2/3     | Horizontal      |
| Switch workspaces                           | *        | 4       | Horizontal      |
| Desktop-Overview-AppGrid-Desktop navigation | *        | 4       | Vertical        |
| Maximize/Unmaximize a window                | Desktop  | 3       | Vertical        |
| Snap/Half-Tile a window                     | Desktop  | 3       | Explained below |


#### For activating tiling gesture
1. Do 3-finger vertical gesture on a unmaximized window
2. Wait for few milliseconds
3. Do 3-finger horizontal gesture to tile a window


## Customization
* For switching to windows from all workspaces using 3-fingers swipe, run 
```
gsettings set org.gnome.shell.window-switcher current-workspace-only false
```

* Add delay to alt-tab gesture, to ensure second windows get's selected, when fast swipe is done.
* Add sensitivity of swipe (touchpad swipe speed)
* Option to 3 fingers to switch workspace on desktop, (4 fingers to switch windows)
* Option to 3 fingers for overview navigation, (4 fingers to maximize/unmaximize/tile)
