Projektas buvo sukurtas naudojant [Create React App](https://github.com/facebook/create-react-app).
## Kam skirtas 

Tai yra **nfq** akademijos stojimo užduoties įgyvendinimas.
Šis puslapis skirtas administruoti lankytojus (šiuo atveju - ligoninės pacientus) bei lankytojams stebėti, kiek reikia laukti iki priėjimo pas specialistą.

## Kaip veikia


### `administracinis puslapis`

Norint, kad specialisto puslapyje, švieslentėje bei pacientui ieškant laiko lankytojo puslapyje
matytųsi rezultatai (pavyzdiniai duomenys, matomi admin puslapyje), pirmiausia reikia **išsaugoti sąrašą**
į **local storage**.
Pridedant naujus duomenis jie iškart išsisaugo į **local storage** ir specialisto, lankytojo bei švieslentės
puslapiuose bus matomi tik naujai įkelti duomenys (jei pavyzdinis sąrašas nebus išsaugotas).

### `specialisto puslapis`

Specialisto puslapyje gali išfiltruoti duomenis pagal specialistą.
Specialistui aptarnavus klientą galima pažymėti, jog šis aptarnautas ir pastarasis pacientas dings
iš sąrašo (tačiau nebus ištrintas iš atminties);

### `švieslentė`

Švieslentėje matomi neaptarnauti pacientai, surikiuoti pagal specialistą ir eilės numerį.
Švieslentėje taip pat matomas laikas, kiek jiems apytiksliai reikėtų laukti.

### `lankytojo puslapis`

Lankytojo puslapyje lankytojas gali įvesti savo eilės numerį ir, jei toks yra, 
lankytojui bus parodytas likęs laikas iki apsilankymo. Patarasis atnaujinamas kas 5 sekundes.

## Išsaugojimas į backend serverį

Admin puslapio kode yra užkomentuotas išsaugojimas į backend serverį.

## Projektas sukurtas naudojant

`react-create-app`
`bootstrap`
`react-bootstrap`



