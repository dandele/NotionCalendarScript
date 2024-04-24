
/*
// Token di accesso per l'API di Notion
const TOKEN = 'secret_T9oy68TJxm4F27FHeMeRaeJCGbpYzGateJ7cgJtEgQC';

// ID del database di origine
const SOURCE_DATABASE_ID = 'b04115769c5c4984baec923b222745f1';

// https://www.notion.so/paradygma/b04115769c5c4984baec923b222745f1?v=0088d954022249489e6cb17fb174fdc8&pvs=4

// ID del database di destinazione
const DESTINATION_DATABASE_ID = '209fc9d9eba4404985ef9aff531a8b3f';

// https://www.notion.so/paradygma/209fc9d9eba4404985ef9aff531a8b3f?v=d450f176d09844b49f1ae44142b886e8&pvs=4





// Link database Working Storeis https://www.notion.so/dd42c95a9d9c430f9d51ca9429e5b720?v=a471efd18c0340afb660afece29fcd73&pvs=4

// Link database Sessioni Storeis
https://www.notion.so/dbd28bc279b54dccb678d94f7bb2a772?v=7653dbaa79ff43afb4c35cc582dd4b9d&pvs=4


// Link database Fotografia Storeis
https://www.notion.so/6a988c2d68364b759183280263113114?v=724e4f6e3ba34e3395fad1118f38ed61&pvs=4






// link db di test creazione https://www.notion.so/paradygma/294093d1943041e3bceb9acfc7f293d5?v=0c04764aae8b4f5eb1583104ee5aa849&pvs=4

*/
  



const fetch = require('axios');
const { Client } = require('@notionhq/client');
const notion = new Client({ auth: 'secret_hORSgU4pMczE4lI6EwmJgaXo3YEldf5EWzi2HFm3vG1' });
let startingTimestamp = '';
let startingID = '';
let startingTimestamp_duplicate = '';
let startingID_duplicate = '';
// let startingEditing_duplicate = '';
let requestCount = 0;
const requestLimit = 3;
// const requestInterval = 1000;  Tempo in millisecondi (1000ms = 1 secondo)
let lastRequestTime = Date.now();
const maxRequestsPerSecond = 2;
const requestInterval = 1000 / maxRequestsPerSecond; 





// Controlla se esiste già una pagina con lo stesso titolo nel database Task_working
async function pageExists(titleItem, results_fotografia_id) {
    const response_duplicate = await notion.databases.query({
        database_id: 'dd42c95a9d9c430f9d51ca9429e5b720',
        filter: {
          and: [
            {
            property: 'Name',
            title: {
                equals: titleItem
            }
            },
            {
            property: 'Tasks_static - ST',
            relation: {
              contains: results_fotografia_id
              }
            },
            ]
        },
        page_size: 1
    });

    return response_duplicate.results.length > 0;
}



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


    // Ricerca nel database Sessioni
    
    const databaseId = 'dbd28bc279b54dccb678d94f7bb2a772';
    const response = await notion.databases.query({
      database_id: databaseId,
       filter: {
        and: [
          {
          property: 'Tasks_static - ST',
          relation: {
            is_empty: true 
            }
          },
        ]
      }, 
      sorts: [
        {
          property: 'Last edited time',
          direction: 'descending',
        },
      ],
      page_size: 1,
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
      const databaseId_fotografia = '6a988c2d68364b759183280263113114';
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

    // Ottieni le relazioni esistenti
    const response_page_sessione = await notion.pages.retrieve({ page_id: results_fotografia_id });
    const existingRelations = response_page_sessione.properties["Sessioni - ST"].relation || [];

    // Aggiungi la nuova relazione alle relazioni esistenti
    const newRelations = [...existingRelations, { id: id_sessione }];
    
    // Aggiornamento pagina static con relation a Sessioni
      const aggiornamento_static = await notion.pages.update({
        page_id: results_fotografia_id,
        properties: {
          "Sessioni - ST": {
          type: 'relation',
          relation: newRelations
        },
      }
      });
      console.log('pagina Sessione aggiornata')


    // Creazione pagina in database Tasks_working con proprietà relative
    if (!(await pageExists(titleItem, results_fotografia_id))) {
      
    
    const response_working = await notion.pages.create({
        "parent": {
          "type": "database_id",
          "database_id": "dd42c95a9d9c430f9d51ca9429e5b720"
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
    } else {
      console.log('La pagina con lo stesso titolo esiste già in Tasks_working');
    }


      
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