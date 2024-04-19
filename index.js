
/*
// Token di accesso per l'API di Notion
const TOKEN = 'secret_T9oy68TJxm4F27FHeMeRaeJCGbpYzGateJ7cgJtEgQC';

// ID del database di origine
const SOURCE_DATABASE_ID = 'b04115769c5c4984baec923b222745f1';

// https://www.notion.so/paradygma/b04115769c5c4984baec923b222745f1?v=0088d954022249489e6cb17fb174fdc8&pvs=4

// ID del database di destinazione
const DESTINATION_DATABASE_ID = '209fc9d9eba4404985ef9aff531a8b3f';

// https://www.notion.so/paradygma/209fc9d9eba4404985ef9aff531a8b3f?v=d450f176d09844b49f1ae44142b886e8&pvs=4




// link db di test creazione https://www.notion.so/paradygma/294093d1943041e3bceb9acfc7f293d5?v=0c04764aae8b4f5eb1583104ee5aa849&pvs=4

*/


const fetch = require('axios');
const { Client } = require('@notionhq/client');
const notion = new Client({ auth: 'secret_T9oy68TJxm4F27FHeMeRaeJCGbpYzGateJ7cgJtEgQC' });
let startingTimestamp = '';
let startingID = '';
let startingTimestamp_duplicate = '';
let startingID_duplicate = '';
// let startingEditing_duplicate = '';
let requestCount = 0;
const requestLimit = 3;
// const requestInterval = 1000;  Tempo in millisecondi (1000ms = 1 secondo)
let lastRequestTime = Date.now();
const maxRequestsPerSecond = 3;
const requestInterval = 1000 / maxRequestsPerSecond; 


// Duplicazione da Static_tasks a Working_tasks

async function fetchData() {
  try {
    const databaseId_sorgente = '8d4a9f7186fa44e7bb94f376ecd0d5df';
    const databaseId_destinazione = '209fc9d9eba4404985ef9aff531a8b3f';
    
    const response_query_fotografia = await notion.databases.query({
      database_id: databaseId_sorgente,
      sorts: [
        {
          property: 'Created time',
          direction: 'descending',
        },
      ],
      page_size: 1,
    });
    // console.log(response_query_fotografia);
    // console.log("hai letto l'ultimo task static creato")

    const response_query_task_id = response_query_fotografia.results[0].id;
    const response_page_query_fotografia = await notion.pages.retrieve({ page_id: response_query_task_id  });
    // console.log('arrivano i dettagli sull ultima pagina recuperata')
    // console.log(response_page_query_fotografia)
    const name_duplicato = response_page_query_fotografia.properties.Name.title[0].plain_text;


    let lastTimestamp_duplicate = response_page_query_fotografia.created_time;
    let lastID_duplicate = response_query_task_id;
    let lastEditing_duplicate = response_page_query_fotografia.last_edited_time;

    if (lastTimestamp_duplicate !== startingTimestamp_duplicate && lastID_duplicate !== startingID_duplicate ) {
      startingTimestamp_duplicate = lastTimestamp_duplicate;
      // const titleItem = results[0].properties.Name.title[0].plain_text;
      // console.log('funzione ok per item ' + titleItem )

    const response_creazione_task_memory = await notion.pages.create({
      "parent": {
        "type": "database_id",
        "database_id": "209fc9d9eba4404985ef9aff531a8b3f"
      },
      "properties": {
        "Name": {
          "title": [
            {
              "text": {
                "content": name_duplicato
              }
            }
          ]
        },
        "Tasks_static - ST": {
          type: 'relation',
          relation: [
            {
              id: response_query_task_id
            }
          ],
        },
      },
    });
    } else {
      console.log('non ci sono nuovi task da duplicare')
    }
  } catch (error) {
    console.error('Errore durante la richiesta:', error);
  }
  finally {
    // Imposta nuovamente l'intervallo di polling
    setTimeout(fetchData, 25000);
  }
}

fetchData(); 








// Funzione che gestisce la creazione della pagina nel database Task_working

async function fetchDataAndCreatePage() {
  try {
    const currentTime = Date.now();
    const timeSinceLastRequest = currentTime - lastRequestTime;

    if (timeSinceLastRequest < requestInterval) {
      const waitTime = requestInterval - timeSinceLastRequest;
      console.log(`Attendi ${waitTime}ms prima di effettuare la prossima richiesta.`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

/*    if (requestCount >= requestLimit) {
      console.warn('Hai raggiunto il limite massimo di richieste. Attendi prima di eseguirne altre.');
      return; // Esce dalla funzione senza eseguire ulteriori richieste
    }
*/
    
    const databaseId = 'b04115769c5c4984baec923b222745f1';
    const response = await notion.databases.query({
      database_id: databaseId,
      /* filter: {
        and: [
          {
          property: 'Tasks_static - ST',
          relation: {
            is_empty: true 
            }
          },
        ]
      }, */
      sorts: [
        {
          property: 'Last edited time',
          direction: 'descending',
        },
      ],
      page_size: 4,
    });
    const results = response.results;
    const id_sessione = results[0].id;
    // Estrarre il titolo della pagina Notion dall'URL
    const url = results[0].url;
    const pageTitle = url.split("/").pop().split("-").join(" ");
    console.log("L'ultima sessione creata è: ", pageTitle);
    
    // console.log('ora iniziano le sessioni')
    // console.log(results);
    // console.log("l'id della sessione è: " + id_sessione)
    //console.log('sopra leggi le sessioni');
    lastRequestTime = Date.now();
    requestCount++;
    console.log(requestCount);



    
    // console.log(results);
    let lastTimestamp = results[0].last_edited_time;
    let lastID = results[0].id;
    
    /* if (lastTimestamp !== startingTimestamp && lastID !== startingID) {
      startingTimestamp = lastTimestamp;
      
      console.log('funzione ok per item ' + titleItem ) */
      

      // Funzione che recupera i task dal database Tasks_static (il database task di fotografia) che ha come link https://www.notion.so/paradygma/8d4a9f7186fa44e7bb94f376ecd0d5df?v=031aa9fdf7404a18944bf217e6c48096&pvs=4
    
      const titleItem = results[0].properties.Name.title[0].plain_text;
      const databaseId_fotografia = '8d4a9f7186fa44e7bb94f376ecd0d5df';
        const response_fotografia = await notion.databases.query({
          database_id: databaseId_fotografia,
          filter: {
            and: [
              {
                property: 'Name',
                rich_text: {
                contains: titleItem
                }
              },
              {
              property: 'Working_tasks',
              relation: {
                is_empty: true 
                }
              },
            ]
          }
        });
      console.log('ok con la query di task static')
      // console.log(response_fotografia)
      const results_fotografia_id = response_fotografia.results[0].id;
      // console.log(results_fotografia_id)
      const response_page = await notion.pages.retrieve({ page_id: results_fotografia_id  });
      // const bu_id_propertyId = response_page.properties.bu_id.id;
      // const progetto_id_propertyId = response_page.properties.progetto_id.id;
      // const response_page_bu_id = await notion.pages.properties.retrieve({ page_id: results_fotografia_id, property_id: bu_id_propertyId });
      // const response_page_progetto_id = await notion.pages.properties.retrieve({ page_id: results_fotografia_id, property_id: progetto_id_propertyId  });
      // const true_progetto_id = response_page_progetto_id.formula.string;
      // const true_bu_id = response_page_bu_id.formula.string;
      
      // console.log(response_page)
      
      // console.log(results_fotografia_id)
      // console.log(response_page_progetto_id )
      // console.log('progetto_id: ' + true_progetto_id + ' bu_id: ' + true_bu_id)


    // Aggiornamento pagina static con relation a Sessioni
      const aggiornamento_static = await notion.pages.update({
        page_id: results_fotografia_id,
        properties: {
          "Sessioni - ST": {
          type: 'relation',
          relation: [
            {
              id: id_sessione
            }
          ],
        },
      }
      });
      console.log('pagina Sessione aggiornata')


    // Creazione pagina in database Tasks_working con proprietà relative

      const response_working = await notion.pages.create({
        "parent": {
          "type": "database_id",
          "database_id": "209fc9d9eba4404985ef9aff531a8b3f"
        },
        "properties": {
          "Name": {
            "title": [
              {
                "text": {
                  "content": titleItem
                }
              }
            ]
          },
          "Tasks_static - ST": {
            type: 'relation',
            relation: [
              {
                id: results_fotografia_id
              }
            ],
          },
          /* "BUs": {
            type: 'relation',
            relation: [
              {
                id: true_bu_id
              }
            ],
          }, */
        },
      });
      requestCount++;
      lastRequestTime = Date.now();
      startingID = response_working.id;
      console.log('nuova pagina creata ' + titleItem)


      
  /* }  else {
      console.log('niente di nuovo')
    } */

    // requestCount++;

    
    // setInterval(fetchDataAndCreatePage, requestInterval);

      } catch (error) {
        console.error("Errore durante la query del database:", error.message);
      }
        finally {
          // Imposta nuovamente l'intervallo di polling
          setTimeout(fetchDataAndCreatePage, requestInterval);
        }
      }
  // setInterval(fetchDataAndCreatePage, requestInterval);

      fetchDataAndCreatePage();
  

    

    
      /* for (const result of results) {
        const responseTitle = await notion.pages.retrieve({ page_id: result.id });
        const title = responseTitle.properties.Name.title[0].plain_text;
        const response = await notion.pages.create({
          "parent": {
            "type": "database_id",
            "database_id": "294093d1943041e3bceb9acfc7f293d5"
          },
          "properties": {
            "Name": {
              "title": [
                {
                  "text": {
                    "content": title
                  }
                }
              ]
            },
          },
        });
      }
      startingTimestamp = results.length; 
    // } else {
    //   console.log("Non ci sono nuovi item nel database sorgente. Nessuna nuova pagina verrà creata nel database destinazione.");
    // }
    */
/*  } catch (error) {
    console.error("Errore durante la query del database:", error.message);
  } 
}

fetchDataAndCreatePage(); */

/* const fetch = require('axios');
const { Client } = require('@notionhq/client');
const notion = new Client({ auth: 'secret_T9oy68TJxm4F27FHeMeRaeJCGbpYzGateJ7cgJtEgQC' });

async function fetchDataAndCreatePage() {
  try {
    const sourceDatabaseId = 'b04115769c5c4984baec923b222745f1';
    const destinationDatabaseId = '294093d1943041e3bceb9acfc7f293d5';
    

    const sourceResponse = await notion.databases.query({
      database_id: sourceDatabaseId,
      sorts: [
        {
          property: 'Last edited time',
          direction: 'descending',
        },
      ],
    });
    const sourceResults = sourceResponse.results;

    const destinationResponse = await notion.databases.query({
      database_id: destinationDatabaseId,
    });
    const destinationResults = destinationResponse.results;

    for (const sourceResult of sourceResults) {
      const sourcePage = await notion.pages.retrieve({ page_id: sourceResult.id });
      const sourceTitle = sourcePage.properties.Name.title[0].plain_text;

      const isDuplicate = destinationResults.some(destinationResult => {
        const destinationPage = notion.pages.retrieve({ page_id: destinationResult.id });
        const destinationTitle = destinationPage.properties.Name.title[0].plain_text;

        return sourceTitle === destinationTitle;
      });

      if (!isDuplicate) {
        const response = await notion.pages.create({
          "parent": {
            "type": "database_id",
            "database_id": destinationDatabaseId
          },
          "properties": {
            "Name": {
              "title": [
                {
                  "text": {
                    "content": sourceTitle
                  }
                }
              ]
            },
          },
        });
      }
    }

  } catch (error) {
    console.error("Errore durante la query del database:", error.message);
  }
}

fetchDataAndCreatePage();







// Creazione pagina in database Tasks

/*
(async () => {
  const response = await notion.pages.create({
    "parent": {
        "type": "database_id",
        "database_id": "209fc9d9eba4404985ef9aff531a8b3f"
    },
    "properties": {
        "Name": {
            "title": [
                {
                    "text": {
                        "content": "Tuscan kale"
                    }
                }
            ]
        },
        "Description": {
            "rich_text": [
                {
                    "text": {
                        "content": "A dark green leafy vegetable"
                    }
                }
            ]
        },
        "Food group": {
            "select": {
                "name": "🥬 Vegetable"
            }
        }
    },
    "children": [
        {
            "object": "block",
            "heading_2": {
                "rich_text": [
                    {
                        "text": {
                            "content": "Lacinato kale"
                        }
                    }
                ]
            }
        },
        {
            "object": "block",
            "paragraph": {
                "rich_text": [
                    {
                        "text": {
                            "content": "Lacinato kale is a variety of kale with a long tradition in Italian cuisine, especially that of Tuscany. It is also known as Tuscan kale, Italian kale, dinosaur kale, kale, flat back kale, palm tree kale, or black Tuscan palm.",
                            "link": {
                                "url": "https://en.wikipedia.org/wiki/Lacinato_kale"
                            }
                        },
                        "href": "https://en.wikipedia.org/wiki/Lacinato_kale"
                    }
                ],
                "color": "default"
            }
        }
    ]
});
  console.log(response);
})();
*/