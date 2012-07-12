/*  Cellular Automata Explorer: Javascript
 *  ======================================
 *  
 *  Create a cae object, give it the element id of a canvas, and pull the rip cord.
 *
 *      m_cae = new cae();
 *      m_cae.init("m_cae_canvas");
 *      m_cae.draw();
 *
 */

function cae() {

    var m_canvas;
    var m_context;
    var width;
    var height;
    var cells = [];
    var mask = [];
    var rule = 129;
    var pixelBufferOne;
    var pixelBufferTwo;
    var bufferFlag = 1;
    var rules = [];
    var line_count = 0;
    var lines_until_switch = 50;

    //min/max lines per randomly chosen rule
    var minLines = 5;
    var maxLines = 25;

    //default pixels per cell to display
    var pixPerCell = 10;

    var cellsWide;
    var cellsHigh;
    
    //frames per second and milliseconds per frame
    var framesPerSecond = 8;     
    var timeBetweenFrames = Math.floor(1000 / framesPerSecond);

    //default list of rules
    var populateRules = function() {
        rules = new Array(57,18,90,129,130,131,132,133);
    }

    //cell data structure
    var cellStruct = function() {
        this.color = 0xffffff;
        this.state = false;
    }

    var initMask = function() {
        mask = [];
        for (idx = 0; idx < 8; idx++) {
            mask.push(Math.pow(2, idx));
        }
    }


    var setCanvasId = function(id) {
        m_canvas = document.getElementById(id);
        m_context = m_canvas.getContext('2d');
        width = m_canvas.width;
        height = m_canvas.height;
        cellsWide = Math.floor(width / pixPerCell);
        cellsHigh = Math.floor(height / pixPerCell);
    }

    var setCSSCanvasId = function(id) {
        m_canvas = document.getElementById(id);
        m_context = m_canvas.getCSSCanvasContext('2d');
        width = m_canvas.width;
        height = m_canvas.height;
        cellsWide = Math.floor(width / pixPerCell);
        cellsHigh = Math.floor(height / pixPerCell);
    }


    var getCell = function(i) {
        var idx = 0;
        if (i==0) {
            if (cells[cellsWide - 1].state)
                idx += 1;
        } else {
            if (cells[(i - 1) % cellsWide].state) {
                idx += 1;
            }
        }
        if (cells[i % cellsWide].state) {
            idx += 2;
        }
        if (i == (cellsWide - 1)) {
            if (cells[0].state) {
                idx += 4;
            }
        } else {
            if (cells[(i + 1) % cellsWide].state) {
                idx += 4;
            }
        }
        return (rule & mask[idx]) ? true : false;
    }

    var drawRow = function() {
        for (idx = 0; idx < cellsWide; idx++) {
            if (cells[idx].state) {
                m_context.fillStyle = 'black';
            } else { 
                m_context.fillStyle = 'white';
            }
            m_context.fillRect(idx * pixPerCell, 0, pixPerCell, pixPerCell);
        }
        var temp = [];
        for (idx = 0; idx < cellsWide; idx++) {
            temp.push(getCell(idx));
        }
        for (idx = 0; idx < cellsWide; idx++) {
            cells[idx].state = temp[idx];
        }
    }

    var copyPixels = function() {
        if (!bufferFlag) {
            m_context.putImageData(pixelBufferTwo, 0, pixPerCell, 0, 0, width, height - pixPerCell);
        } else {
            m_context.putImageData(pixelBufferOne, 0, pixPerCell, 0, 0, width, height - pixPerCell);
        }
    }

    var flipBuffers = function() {
        if (bufferFlag) {
            pixelBufferTwo = m_context.getImageData(0, 0, width, height - pixPerCell);
            bufferFlag--;
        } else {
            pixelBufferOne = m_context.getImageData(0, 0, width, height - pixPerCell);
            bufferFlag++;
        }
    }

    var isDead = function() {
        var total = 0;
        for (idx = 0; idx < cells.length; idx++) {
            if (cells[idx].state) {
                total += 1;
            }
        }
        if ((total == width) || (total == 0)) {
            return true;
        }
        return false;
    }

    var reset = function() {
        cells = [];
        for (count = 0; count < cellsWide; count++) {
            cells.push(new cellStruct());
        }
        cells[Math.floor(cellsWide / 2)].state = true;
    }

    var switchRule = function() {
        if (line_count >= lines_until_switch) {
            line_count = 0;
            lines_until_switch = minLines + (Math.random() * ((maxLines - minLines) + 1));
            return true;
        }
        return false;
    }

    var changeRule = function() {
        rule = rules[Math.floor(Math.random() * rules.length)];
    }

    var iterate = function() {
        line_count++;
        copyPixels();
        drawRow();
        flipBuffers();
        if (isDead()) {
            reset();
            changeRule();
        } else {
            if (switchRule()) {
                console.log("changeRule");
                changeRule();
            }
        }
    }

    this.setPixelsPerCell = function(pix) {
        if ((pix > 0) && (pix < Math.min(width,height))) {
            pixPerCell = pix;
        }
    }

    this.draw = function() {
        setInterval(function(){iterate()}, timeBetweenFrames);
    }

    this.init = function(id) {
        setCanvasId(id);
        pixelBufferOne = m_context.createImageData(width, height - 1);
        pixelBufferTwo = m_context.createImageData(width, height - 1);
        populateRules();
        changeRule();
        reset();
        initMask();
    }

    this.initCSS = function(id) {
        setCSSCanvasId(id);
        pixelBufferOne = m_context.createImageData(width, height - 1);
        pixelBufferTwo = m_context.createImageData(width, height - 1);
        populateRules();
        changeRule();
        reset();
        initMask();
    }

    this.getCanvas = function() {
        return m_canvas;
    }

}
