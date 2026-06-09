"use strict";

const InputMode = 
{
    NULL                        : -1,
    LOAD_SWIMBOT_FROM_PRESET    :  0,
    LOAD_SWIMBOT_FROM_FILE      :  1,
    SAVE_SWIMBOT                :  2,
    LOAD_POOL_FROM_PRESET       :  3,
    LOAD_POOL_FROM_FILE         :  4,
    SAVE_POOL                   :  5
};

let _inputFilenameString    = "";
let _inputMode              = InputMode.NULL;
let _chosenPoolToLoad       = 0;

function addToFilenameInputString(e)
{
    _inputFilenameString = e.currentTarget.value;
    
    if (e.key === 'Enter')
    {
        submitFilenameInput();
    }
}

function submitFilenameInput()
{
    if (_savedBeforeLoad)
    {
        loadPool();        
        _savedBeforeLoad = false;

        _inputMode = InputMode.LOAD_POOL_FROM_FILE;
    }
    else
    {    
        // load swimbot
        if (_inputMode === InputMode.LOAD_SWIMBOT_FROM_FILE)
        {
            
            let swimbotLookup = _database.getLookupTable('swimbots');

            let userOfSwimbot = "";

            let swimbotToLoad = swimbotLookup.find
            (
                function (swimbot) 
                {
                    userOfSwimbot = swimbot.user;
                    return swimbot.name === _inputFilenameString;
                }
           );
            
            if ((swimbotToLoad)
            &&  (userOfSwimbot === _username))
            {
                document.getElementById('PopUpPanelError').style.visibility = "visible";  
                document.getElementById('PopUpPanelError').style.borderWidth = 2; 
                document.getElementById('PopUpPanelError').style.borderColor = "#555555";
                document.getElementById('PopUpPanelError').innerHTML 
                = "<br>"
                + "&nbsp&nbsp loading data for swimbot '" + _inputFilenameString + "'";

                _database.loadObject
                (
                    'swimbots', 
                    swimbotToLoad.key, 
                
                    function(data) 
                    {
                        if (data) 
                        {
                            genePool.createNewSwimbotWithGenes(data.genes);
                            closePopupPanel();
                            _inputFilenameString = "";
                        }
                    }
               );
            }
            else
            {
                document.getElementById('cancelErrorButton').style.visibility = "visible";  
                  
                document.getElementById('PopUpPanelError').style.visibility = "visible";        
                document.getElementById('PopUpPanelError').style.borderWidth = 5; 
                document.getElementById('PopUpPanelError').style.borderColor = "#883300";
                document.getElementById('PopUpPanelError').innerHTML 
                = "<br>"
                + "&nbsp&nbsp ERROR:"
                + "<br>"
                + "&nbsp&nbsp Could not find swimbot file '" + _inputFilenameString + "'"
                + "<br>"
                + "&nbsp&nbsp Try a different name";
            }
        }

        // save swimbot
        else if (_inputMode === InputMode.SAVE_SWIMBOT)
        {
            let selectedSwimbot = genePool.getSelectedSwimbotID();

            if (selectedSwimbot != -1)
            {
                
                let date = new Date();
                let dateInSeconds = date.getTime();
            
                let genes = genePool.getSwimbotGenes(selectedSwimbot);
                let swimbotWithMetaData = ({ 'name': _inputFilenameString, 'date' : dateInSeconds, 'user': _username, 'genes': genes });
            
                _database.add('swimbots', swimbotWithMetaData);            
                closePopupPanel();
                _inputFilenameString = "";
            }
        }
    
        // load pool
        else if (_inputMode === InputMode.LOAD_POOL_FROM_FILE)
        {

             let poolLookup = _database.getLookupTable('pools');

            let poolToLoad = poolLookup.find
            (
                function (pool) 
                {
                    return pool.name === _inputFilenameString;
                }
           );

            if (poolToLoad) 
            {
                document.getElementById('PopUpPanelError').style.visibility  = "visible";   
                document.getElementById('PopUpPanelError').style.borderWidth = 2; 
                document.getElementById('PopUpPanelError').style.borderColor = "#555555";
                document.getElementById('PopUpPanelError').innerHTML 
                = "<br>"
                + "&nbsp&nbsp loading data for pool '" + _inputFilenameString + "'";

                _database.loadObject
                (
                    'pools', 
                    poolToLoad.key, 
                
                    function(data) 
                    {
                        if (data) 
                        {
                            genePool.setPoolData(data.pool);
                            closePopupPanel();
                            _inputFilenameString = "";
                        }
                    }
               );
            }       
            else
            {
                document.getElementById('PopUpPanelError').style.visibility  = "visible";  
                document.getElementById('PopUpPanelError').style.borderWidth = 5; 
                document.getElementById('PopUpPanelError').style.borderColor = "#883300";
                document.getElementById('PopUpPanelError').innerHTML 
                = "<br>"
                + "&nbsp&nbsp ERROR:"
                + "<br>"
                + "&nbsp&nbsp Could not find pool file '" + _inputFilenameString + "'"
                + "<br>"
                + "&nbsp&nbsp Try a different name";
            } 
        }
    
        // save pool
        else if (_inputMode === InputMode.SAVE_POOL)
        {

             let date = new Date();
            let dateInSeconds = date.getTime();
            let pool = genePool.getPoolData();     
    
            let poolWithMetaData = ({ 'name': _inputFilenameString, 'date': dateInSeconds, 'user': _username, 'pool': pool });       
    
            _database.add('pools', poolWithMetaData);
            closePopupPanel();
            _inputFilenameString = "";
        }

        // cancel input mode
        _inputMode = InputMode.NULL;
    }
}

// these four save/load calls are made from html...
function readLocalFile(event)
{
    let fileList = event.target.files;
    
    let file = fileList[0];   
    
    let reader = new FileReader();
}

function printFamilyTree()
{
    genePool.generatePhyloTree();

    let w = window.open
     (
         "", 
         "swimbot data", 
         "left=400, top=100, width=600, height=700, status=0, resizable=0, channelmode=0, menubar=0, toolbar=0, location=0, titlebar=0" 
    );
    
    
    w.document.title = "Swimbot Data (copy and paste into a text file, then load into Gene Pool Lab)";

    let familyTree = genePool.getFamilyTree();
     
    let f = "";

    const THROTTLE = 5;

    for (let n = 0; n < familyTree.getNumNodes(); n += THROTTLE)
    {
        f += "swimbot index: " + n.toString();
        f += "<br>";
        f += "parent 1 index: " + familyTree.getNodeParent1Index(n).toString();
        f += "<br>";
        f += "parent 2 index: " + familyTree.getNodeParent2Index(n).toString();
        f += "<br>";
        f += "birth time: " + familyTree.getNodeBirthTime(n).toString();
        f += "<br>";
        f += "death time: " + familyTree.getNodeDeathTime(n).toString();
        f += "<br>";
        f += "genes: ";
        f += "<br>";

        let genes = familyTree.getNodeGenes(n);

        for (let g = 0; g < genes.length; g++)
        {
            f += genes[g].toString();
            if (g < genes.length - 1) 
            {
                f += ", ";
            }
        }

        f += "<br>";
        f += "<br>";
    }

    w.document.body.innerHTML = f;
}

function loadPool()
{
    if (_chosenPoolToLoad === SimulationStartMode.FILE)
    {
        openPopupPanelForInput("Load a new pool from a file", InputMode.LOAD_POOL_FROM_FILE);               
    }
    else
    {
        switchToChosenPresetPool();
    }
}

function openPopupPanelForInput(text, mode)
{
    _inputMode = mode;   

    // make sure these are turned off  
    document.getElementById('noSavePopUpPanelButton'  ).style.visibility = "hidden";   
    document.getElementById('savePopUpPanelButton'    ).style.visibility = "hidden";  
    document.getElementById('dataDisplayButton'       ).style.visibility = "hidden";   

    // turn these on  
    document.getElementById('popUpPanel'              ).style.visibility = "visible";   
    document.getElementById('cancelPopUpPanelButton'  ).style.visibility = "visible";    
    document.getElementById('popUpPanelInput'         ).style.visibility = "visible";   
    document.getElementById('submitFilenameButton'    ).style.visibility = "visible";   

    // give focus to the input  
    document.getElementById("popUpPanelInput").focus();     

    // default case...
    document.getElementById("popUpPanelInput"     ).style.top = "185px";         
    document.getElementById("submitFilenameButton").style.top = "185px";     

    if (_inputMode === InputMode.SAVE_SWIMBOT)
    {
        document.getElementById("loadedList"  ).style.visibility = "hidden";   
    
        document.getElementById("PopupText").style.visibility = "visible";   
        document.getElementById("PopupText").innerHTML 
        = text
        + "<br>"
        + "<br>"
        + "Name this swimbot...";

        // give user option to display data...  
        document.getElementById('dataDisplayButton'   ).style.visibility = "visible";   
    }
    else if (_inputMode === InputMode.LOAD_SWIMBOT_FROM_FILE)
    {
        document.getElementById("PopupText").style.visibility = "visible";   
        document.getElementById("PopupText").innerHTML
        = text
        + "<br>"
        + "<br>"
        + "choose from the list of saved swimbots:"
        + "<br>"
        + "<br>";
        
        document.getElementById("popUpPanelInput"     ).style.top = "290px";     
        document.getElementById("submitFilenameButton").style.top = "290px";  

        document.getElementById("loadedList").style.visibility = "visible";   
        document.getElementById("loadedList").innerHTML = "";  
    
        let swimbotLookup = _database.getLookupTable('swimbots');

        for (let s = 0; s < swimbotLookup.length; s++)
        {    
            if (swimbotLookup[s].user === _username)
            {
                let loadSwimbotButton = document.createElement("BUTTON");

                loadSwimbotButton.id = "swimbotLoadButton_" + s.toString();

                loadSwimbotButton.innerHTML = swimbotLookup[s].name 

                document.getElementById("loadedList").appendChild(loadSwimbotButton);

                loadSwimbotButton.onmousedown = function(e)
                 {
                     _inputFilenameString = swimbotLookup[s].name;
                    document.getElementById('popUpPanelInput').value = swimbotLookup[s].name;
                }
            }
        }
    }

    // clear-out input string...  
    _inputFilenameString = "";
    document.getElementById('popUpPanelInput').value = '';
}

function displayData(filename)
{
    if (_inputMode === InputMode.SAVE_SWIMBOT)
    {
         showSwimbotGenes(genePool.getSelectedSwimbotID());
    }
    else if (_inputMode === InputMode.SAVE_POOL)
    {

        let pool = genePool.getPoolData();
        let json = JSON.stringify({ pool });

        document.getElementById('dataDisplay'     ).style.visibility = "visible"; 
        document.getElementById('closeDataDisplay').style.visibility = "visible"; 
        document.getElementById('dataDisplay'     ).innerHTML
        = "Copy the text below, put it in a new text file, and then give"
        + "<br>" 
        + "the file a unique name ending in '.json' (example: 'my_pool.json')"
        + "<br>"
        + "<br>"
        + "_________________"
        + "<br>"
        + "<br>"
        + json;        
    }
}

function showSwimbotGenes(s)
{
    if (s != -1)
    {        
        let genes = genePool.getSwimbotGenes(s);        
        let json = JSON.stringify({ genes });
    
        document.getElementById('dataDisplay'     ).style.visibility = "visible"; 
        document.getElementById('closeDataDisplay').style.visibility = "visible"; 
        document.getElementById('dataDisplay'     ).innerHTML 
        = "<br>" 
        + "<big><b>Save genes of swimbot " + s.toString() + "</b></big>"
        + "<br>" 
        + "<br>" 
        + "Please copy the genetic data below and put it in an "
        + "<br>"
        + "empty text file. Give it a cool name and save it."
        + "<br>"
        + "<br>"
        + "This is formatted as JSON, which is required "
        + "<br>"
        + "for it to be loaded back into the pool."
        + "<br>"
        + "<br>"
        + "<br>"
        + "<br>"
        + json;
    }
}

function closeDataDisplay()
{
    document.getElementById('dataDisplay'     ).style.visibility = "hidden"; 
    document.getElementById('closeDataDisplay').style.visibility = "hidden"; 
}
