const EmptyDestination = {
  name: ``,
  description: ``,
  photos: [],
};

const OFFER_NAME_PREFIX = `event-offer-`;

export const parseFormData = (id, formDataComponent, formData, destinations, allOffers) => {
  const destinationName = formData.get(`event-destination`);
  const destination = destinations.find(({name}) => name === destinationName) || EmptyDestination;

  const type = formData.get(`event-type`);
  const typeOffers = allOffers[type];

  const offerInputs = Array.from(formDataComponent.getElement().querySelectorAll(`.event__offer-checkbox:checked`));

  const offers = offerInputs.map((offer) => {
    const offerId = offer.name.substring(OFFER_NAME_PREFIX.length);

    return typeOffers.find((typeOffer) =>
      typeOffer.id === offerId);
  });

  return {
    id,
    type,
    destination,
    start: new Date(formData.get(`event-start-time`)),
    end: new Date(formData.get(`event-end-time`)),
    basePrice: Number(formData.get(`event-price`)),
    offers,
    isFavorite: formData.has(`event-favorite`),
  };
};
