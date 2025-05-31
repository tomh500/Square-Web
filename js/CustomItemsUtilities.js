
   let yamlData = {};

    function renderEditor() {
        const container = document.getElementById('editor');
        container.innerHTML = '';

        Object.entries(yamlData).forEach(([id, g]) => {
            const entry = document.createElement('div');
            entry.className = 'grenade-entry';

            const header = document.createElement('div');
            header.className = 'grenade-header';
            header.textContent = g.displayname || id;

            const body = document.createElement('div');
            body.className = 'grenade-body';

            header.onclick = () => {
                body.style.display = body.style.display === 'none' ? 'block' : 'none';
            };

            // ✅ 唯一标识符 ID 输入
            const idGroup = document.createElement('div');
            idGroup.className = 'field-group';
            const idLabel = document.createElement('label');
            idLabel.textContent = '唯一标识符 ID';
            const idInput = document.createElement('input');
            idInput.value = id;
            idInput.addEventListener('change', (e) => {
                const newId = e.target.value.trim();
                if (!newId || newId === id || yamlData[newId]) {
                    alert("ID 无效或已存在！");
                    idInput.value = id;
                    return;
                }
                yamlData[newId] = yamlData[id];
                delete yamlData[id];
                renderEditor();
            });
            idGroup.appendChild(idLabel);
            idGroup.appendChild(idInput);
            body.appendChild(idGroup);

            // 字段辅助函数
            function addField(labelText, key, object = g) {
                const group = document.createElement('div');
                group.className = 'field-group';
                const label = document.createElement('label');
                label.textContent = labelText;
                const input = document.createElement('input');
                input.value = object[key] ?? '';
                input.addEventListener('input', e => {
                    object[key] = e.target.value;
                });
                group.appendChild(label);
                group.appendChild(input);
                body.appendChild(group);
            }

            addField("显示名称", 'displayname');
            addField("文件名", 'filename');
            addField("地图", 'map');
            addField("类型", 'type');
            addField("投掷方式", 'throwmode');
            addField("灵敏度", 'sensitivity');

            const angleGroup = document.createElement('div');
            angleGroup.className = 'inline-group';
            ['yaw', 'pitch'].forEach((angle) => {
                const group = document.createElement('div');
                group.className = 'field-group';
                const label = document.createElement('label');
                label.textContent = `角度 ${angle}`;
                const input = document.createElement('input');
                input.type = 'number';
                input.value = g[angle] ?? 0;
                input.addEventListener('input', e => {
                    g[angle] = parseFloat(e.target.value);
                });
                group.appendChild(label);
                group.appendChild(input);
                angleGroup.appendChild(group);
            });
            body.appendChild(angleGroup);

            ['投掷前命令 (Extra[0])', '投掷后命令 (Extra[1])'].forEach((label, idx) => {
                const group = document.createElement('div');
                group.className = 'field-group';
                const lbl = document.createElement('label');
                lbl.textContent = label;
                const input = document.createElement('input');
                input.value = g.extra?.[idx] ?? '';
                input.addEventListener('input', e => {
                    g.extra = g.extra || ['', ''];
                    g.extra[idx] = e.target.value;
                });
                group.appendChild(lbl);
                group.appendChild(input);
                body.appendChild(group);
            });

            const selectFields = ['page', 'slot', 'command', 'bind'];
            selectFields.forEach((key, idx) => {
                const group = document.createElement('div');
                group.className = 'field-group';
                const lbl = document.createElement('label');
                lbl.textContent = `轮盘 ${key}`;
                const input = document.createElement('input');
                input.value = g.select?.[idx]?.[key] ?? '';
                input.addEventListener('input', e => {
                    g.select = g.select || [{}, {}, {}, {}];
                    g.select[idx][key] = e.target.value;
                });
                group.appendChild(lbl);
                group.appendChild(input);
                body.appendChild(group);
            });

            const posGroup = document.createElement('div');
            posGroup.className = 'inline-group';
            ['x', 'z', 'y'].forEach((coord, idx) => {
                const group = document.createElement('div');
                group.className = 'field-group';
                const label = document.createElement('label');
                label.textContent = `坐标 ${coord}`;
                const input = document.createElement('input');
                input.type = 'number';
                input.value = g.setpos?.[idx]?.[coord] ?? 0;
                input.addEventListener('input', e => {
                    g.setpos = g.setpos || [{}, {}, {}];
                    g.setpos[idx][coord] = parseFloat(e.target.value);
                });
                group.appendChild(label);
                group.appendChild(input);
                posGroup.appendChild(group);
            });
            body.appendChild(posGroup);

            entry.appendChild(header);
            entry.appendChild(body);
            container.appendChild(entry);
        });
    }
    
    document.getElementById('calcInput').addEventListener('input', function () {
    const input = this.value;
    const pitchYawRegex = /setang\s+(-?\d+\.?\d*)\s+(-?\d+\.?\d*)/;
    const match = input.match(pitchYawRegex);

    if (match) {
        const pitch = parseFloat(match[1]);
        const yaw = parseFloat(match[2]);
        const sensitivity = 2.52;
        const yawPitchRatio = 0.022;

        const resultPitch = (pitch / (sensitivity * yawPitchRatio)).toFixed(6);
        const resultYaw = (-1 * yaw / (sensitivity * yawPitchRatio)).toFixed(6);

        document.getElementById('outputPitch').value = resultPitch;

        document.getElementById('outputYaw').value = resultYaw;
    } else {
        document.getElementById('outputPitch').value = '';
        document.getElementById('outputYaw').value = '';
    }
});


    document.getElementById('fileInput').addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                yamlData = jsyaml.load(e.target.result) || {};
                renderEditor();
            } catch (err) {
                alert("解析失败：" + err.message);
            }
        };
        reader.readAsText(file);
    });

    function addEntry() {
        const id = `item_${Date.now()}`;
        yamlData[id] = {
            filename: `${id}.cfg`,
            displayname: "新道具",
            map: "Dust2",
            sensitivity: 2.52,
            yaw: 0,
            pitch: 0,
            type: "smoke",
            throwmode: "Normal",
            extra: ["", ""],
            select: [{ page: "" }, { slot: "" }, { command: "" }, { bind: "None" }],
            setpos: [{ x: 0 }, { z: 0 }, { y: 100 }]
        };
        renderEditor();
    }


  function downloadYAML() {
      const lines = [];

      for (const [id, data] of Object.entries(yamlData)) {
          // 顶层 ID
          lines.push(`${id}:`);

          // 普通字段，一律双引号
          ['filename', 'displayname', 'map', 'sensitivity', 'yaw', 'pitch', 'type', 'throwmode']
              .forEach(key => {
                  const val = data[key] ?? '';
                  lines.push(`  ${key}: "${val}"`);
              });

          // extra（内联数组）
          const e0 = data.extra?.[0] ?? '';
          const e1 = data.extra?.[1] ?? '';
          lines.push(`  extra: ["${e0}","${e1}"]`);

          // select（block sequence + 单键 mapping）
          lines.push(`  select:`);
          (data.select || []).forEach((obj, i) => {
              // 按顺序 page, slot, command, bind
              const key = ['page','slot','command','bind'][i];
              const val = obj[key] ?? '';
              lines.push(`    - ${key}: "${val}"`);
          });

          // setpos（同上）
          lines.push(`  setpos:`);
          (data.setpos || []).forEach((obj, i) => {
              const key = ['x','z','y'][i];
              const val = obj[key] ?? '';
              lines.push(`    - ${key}: "${val}"`);
          });

          // 各道具之间空一行
          lines.push('');
      }

      const finalYaml = lines.join('\n');
      const blob = new Blob([finalYaml], { type: 'application/x-yaml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Custom.yml';
      a.click();
      URL.revokeObjectURL(url);
  }
