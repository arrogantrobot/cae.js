function cae() {

    var m_canvas;
    var m_context;
    var width;
    var height;
    var cells = [];
    var mask = [];
    var rule = 129;
    var pixelBufferOne; //= new Image();
    var pixelBufferTwo; //= new Image();
    var bufferFlag = 0;

    var cell = function() {
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
    }


    var getCell = function(i) {
        var idx = 0;
        if (i==0) {
            if (cells[width - 1].state)
                idx += 1;
        } else {
            if (cells[(i - 1) % width].state) {
                idx += 1;
            }
        }
        if (cells[i % width].state) {
            idx += 2;
        }
        if (i == (width - 1)) {
            if (cells[0].state) {
                idx += 4;
            }
        } else {
            if (cells[(i + 1) % width].state) {
                idx += 4;
            }
        }
        return (rule & mask[idx]) ? true : false;
    }

    var drawRow = function() {
        for (idx = 0; idx < width; idx++) {
            if (cells[idx].state) {
                m_context.fillStyle = 'black';
            } else { 
                m_context.fillStyle = 'white';
            }
            m_context.fillRect(idx, 0, 1, 1);
        }
        var temp = [];
        for (idx = 0; idx < width; idx++) {
            temp.push(getCell(idx));
        }
        for (idx = 0; idx < width; idx++) {
            cells[idx].state = temp[idx];
        }
    }

    var copyPixels = function() {
        if (bufferFlag) {
            m_context.putImageData(pixelBufferTwo, 0, 1, 0, 0, width, height - 1);
        } else {
            m_context.putImageData(pixelBufferOne, 0, 1, 0, 0, width, height - 1);
        }
    }

    var flipBuffers = function() {
        if (bufferFlag) {
            pixelBufferTwo = m_context.getImageData(0, 0, width, height);
            bufferFlag--;
        } else {
            pixelBufferOne = m_context.getImageData(0, 0, width, height);
            bufferFlag++;
        }
    }

    var iterate = function() {
        copyPixels();
        drawRow();
        flipBuffers();
    }

    this.draw = function() {
        setInterval(function(){iterate()},20);
    }

    this.init = function(id) {
        setCanvasId(id);
        pixelBufferOne = m_context.createImageData(width, height);
        pixelBufferTwo = m_context.createImageData(width, height);
        for (count = 0; count < width; count++) {
            cells.push(new cell());
        }
        cells[Math.floor(width/2)].state = true;
        initMask();
    }

    this.getCanvas = function() {
        return m_canvas;
    }

}
