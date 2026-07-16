import { InternalServerErrorException } from "@nestjs/common";
import { aircraftTypes } from "./mock/aircraftData";

export function generateRandomSeats(aircraftType: string): string[] {
  const config = aircraftTypes.find(a => a.type === aircraftType);

  if (!config) {
    throw new InternalServerErrorException('Aircraft configuration not found');
  }

  const maxRow = config.maxRows;
  const seatLetters = config.seatLetters.split(', ');

  const seats = new Set<string>();

  while (seats.size < 3) {
    const randomRow = Math.floor(Math.random() * maxRow) + 1;
    const randomLetter = seatLetters[Math.floor(Math.random() * seatLetters.length)];
    seats.add(`${randomRow}${randomLetter}`);
  }

  return Array.from(seats);
}
