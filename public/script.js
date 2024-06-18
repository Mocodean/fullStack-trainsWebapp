/* eslint-disable no-undef */
async function getDetails(trainId) {
  try {
    await fetch(`/tipus/${trainId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const show = document.getElementById(`show${trainId}`).style.display;
        if (show === 'table-cell') document.getElementById(`show${trainId}`).style.display = 'none';
        else {
          document.getElementById(`show${trainId}`).style.display = 'table-cell';
          document.getElementById(`show${trainId}`).innerText = data;
        }
      });
  } catch (err) {
    console.error(err);
    const message = document.getElementById('message');
    message.innerText = 'Internal server error';
    message.style.display = 'block';
  }
}

async function deleteFoglalas(foglalasId) {
  try {
    console.log(foglalasId);
    await fetch(`/torol/${foglalasId}`, { method: 'POST' })
      .then((response) => response.json())
      .then((data) => {
        // torolt sor eltuntetese

        const row = document.getElementById(foglalasId);
        console.log(data.message);
        row.parentNode.removeChild(row);
      });
  } catch (err) {
    console.error(err);
    const message = document.getElementById('message');
    message.innerText = 'Internal server error';
    message.style.display = 'block';
  }
}

async function modifyForm(trainId) {
  try {
    console.log(trainId);
    await fetch(`/form/${trainId}`)
      .then((response) => response.json())
      .then((data) => {
        const row = document.getElementById(`modify${trainId}`).style.display;
        console.log(data);
        if (row === 'table-cell') document.getElementById(`modify${trainId}`).style.display = 'none';
        else {
          document.getElementById(`from${trainId}`).value = data.honnan;
          document.getElementById(`to${trainId}`).value = data.hova;
          document.getElementById(`day${trainId}`).value = data.day;
          document.getElementById(`trainprice${trainId}`).value = data.trainprice;
          document.getElementById(`traintype${trainId}`).value = data.traintype;
          document.getElementById(`departuretime${trainId}`).value = data.departuretime;
          document.getElementById(`arrivaltime${trainId}`).value = data.arrivaltime;

          document.getElementById(`modify${trainId}`).style.display = 'table-cell';
        }
      });
  } catch (err) {
    console.error(err);
    const message = document.getElementById('message');
    message.innerText = 'Internal server error';
    message.style.display = 'block';
  }
}

async function modifyTrain(trainId) {
  try {
    console.log(trainId);
    console.log('modositas belep');
    const from = document.getElementById(`from${trainId}`).value;
    const to = document.getElementById(`to${trainId}`).value;
    const day = document.getElementById(`day${trainId}`).value;
    const departuretime = document.getElementById(`departuretime${trainId}`).value;
    const arrivaltime = document.getElementById(`arrivaltime${trainId}`).value;
    const trainprice = document.getElementById(`trainprice${trainId}`).value;
    const traintype = document.getElementById(`traintype${trainId}`).value;

    const train = {
      from,
      to,
      day,
      departuretime,
      arrivaltime,
      trainprice,
      traintype,
    };

    await fetch(`/modosit/${trainId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(train),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        document.getElementById(`tfrom${trainId}`).innerText = data.newTrain.honnan;
        document.getElementById(`tto${trainId}`).innerText = data.newTrain.hova;
        document.getElementById(`tday${trainId}`).innerText = data.newTrain.day;
        document.getElementById(`tprice${trainId}`).innerText = data.newTrain.trainprice;
        document.getElementById(`ttype${trainId}`).innerText = data.newTrain.traintype;
        document.getElementById(`tdeparturetime${trainId}`).innerText = data.newTrain.departuretime;
        document.getElementById(`tarrivaltime${trainId}`).innerText = data.newTrain.arrivaltime;
        document.getElementById(`modify${trainId}`).style.display = 'none';
      });
  } catch (err) {
    console.error(err);
    const message = document.getElementById('message');
    message.innerText = 'Internal server error';
    message.style.display = 'block';
  }
}

// USUNG AXIOS
async function deleteTrain(trainId) {
  try {
    await axios.delete(`/vonat/${trainId}`).then((response) => {
      console.log(response.data);
      const row = document.getElementById(`vonatsor${trainId}`);
      row.parentNode.removeChild(row);
    });
  } catch (err) {
    console.error(err);
    const message = document.getElementById('message');
    message.innerText = 'Internal server error';
    message.style.display = 'block';
  }
}

async function showModifyDate(foglalasId) {
  try {
    console.log(foglalasId);
    await fetch(`/datum/${foglalasId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        const form = document.getElementById(`formdatum${foglalasId}`).style.display;
        if (form === 'table-cell') document.getElementById(`formdatum${foglalasId}`).style.display = 'none';
        else {
          const date = data.split('T')[0];
          document.getElementById(`datumfelepit${foglalasId}`).value = date;
          document.getElementById(`formdatum${foglalasId}`).style.display = 'table-cell';
        }
      });
  } catch (err) {
    console.error(err);
    const message = document.getElementById('message');
    message.innerText = 'Internal server error';
    message.style.display = 'block';
  }
}

async function saveModifyDate(foglalasId) {
  try {
    console.log(foglalasId);
    const date = document.getElementById(`datumfelepit${foglalasId}`).value;
    console.log(date);

    await fetch(`/datum/${foglalasId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        // replace - with .
        const newdate = data.date.split('-').join('. ');
        document.getElementById(`modositot${foglalasId}`).innerText = `${newdate}.`;
        document.getElementById(`formdatum${foglalasId}`).style.display = 'none';
      });
  } catch (err) {
    console.error(err);
    const message = document.getElementById('message');
    message.innerText = 'Internal server error';
    message.style.display = 'block';
  }
}

window.onload = () => {
  const details = document.getElementsByClassName('details_b');
  for (let i = 0; i < details.length; i += 1) {
    details[i].addEventListener('click', () => {
      getDetails(details[i].id);
    });
  }

  /*
  details.forEach((detail) => {
    detail.addEventListener('click', () => {
      getDetails(detail.id);
    });
  }); */

  const deletes = document.getElementsByClassName('btn btn-danger btn-sm delete_foglalas');
  console.log(deletes);
  for (let i = 0; i < deletes.length; i += 1) {
    deletes[i].addEventListener('click', () => {
      deleteFoglalas(deletes[i].id);
    });
  }

  const midifyTrains = document.getElementsByClassName('form btn btn-warning');
  for (let i = 0; i < midifyTrains.length; i += 1) {
    midifyTrains[i].addEventListener('click', () => {
      modifyForm(midifyTrains[i].id);
    });
  }

  const modify = document.getElementsByClassName('btn btn-primary w-100 frisit');
  for (let i = 0; i < modify.length; i += 1) {
    modify[i].addEventListener('click', () => {
      modifyTrain(modify[i].id);
    });
  }

  const modifyDates = document.getElementsByClassName('mutat btn btn-warning btn-sm');
  for (let i = 0; i < modifyDates.length; i += 1) {
    modifyDates[i].addEventListener('click', () => {
      showModifyDate(modifyDates[i].id);
    });
  }

  const saveModifyDates = document.getElementsByClassName('btn btn-primary w-100 menteees');
  for (let i = 0; i < saveModifyDates.length; i += 1) {
    saveModifyDates[i].addEventListener('click', () => {
      saveModifyDate(saveModifyDates[i].id);
    });
  }
  const deleteTrainButtons = document.getElementsByClassName('btn btn-danger torol');
  for (let i = 0; i < deleteTrainButtons.length; i += 1) {
    deleteTrainButtons[i].addEventListener('click', () => {
      deleteTrain(deleteTrainButtons[i].id);
    });
  }

  const deleteReservations = document.getElementsByClassName('btn btn-danger btn-sm torolfoglalasuser');
  for (let i = 0; i < deleteReservations.length; i += 1) {
    deleteReservations[i].addEventListener('click', () => {
      deleteFoglalas(deleteReservations[i].id);
    });
  }
};
