function cae() {

    var m_canvas;
    var m_context;
    var width;
    var height;
    var cells = [];
    var mask = [];
    var rule = 129;

    var cell = function() {
        this.color = 0xffffff;
        this.state = 0;
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


    var getCell = function(lastRow, i) {
        var idx = 0;
        if (i==0) {
            if (lastRow.get(width - 1))
                idx += 1;
        } else {
            if (lastRow.get((i - 1) % width)) {
                idx += 1;
            }
        }
        if (lastRow.get(i % width)) {
            idx += 2;
        }
        if (i == (width - 1)) {
            if (lastRow.get(0)) {
                idx += 4;
            }
        } else {
            if (lastRow.get((i + 1) % width)) {
                idx += 4;
            }
        }
        return (rule & mask[idx]) ? true : false;
    }

    var drawRow = function() {
        for (idx = 0; idx < width; idx++) {
            if (cells.get(idx).state) {
                m_context.fillStyle = 'black';
            } else { 
                m_context.fillStyle = 'white';
            }
            m_context.fillRect(idx, 0, 1, height);
        }
        var temp = [];
        for (idx = 0; idx < width; idx++) {
            temp.push(cells);
        }
        for (idx = 0; idx < width; idx++) {
            cells.get(idx).state = temp.get(idx);
        }
    }

    this.draw = function() {
        for (count = 0; count < 100; count++)  drawRow();
    }

    this.init = function(id) {
        setCanvasId(id);
        for (count = 0; count < width; count++) {
            cells.push(new cell());
        }
        cells[Math.floor(width/2)].state = 1;
        initMask();
    }

    this.getCanvas = function() {
        return m_canvas;
    }

}
