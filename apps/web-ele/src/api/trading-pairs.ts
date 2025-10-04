import { requestClient } from '#/api/request';

interface TradingPairsResponse {
  exchange_name: string;
  trading_pairs: string[];
}

/**
 * @description Get Trading Pairs by Exchange
 * Retrieves a list of trading pairs for a given exchange.
 */
export async function getTradingPairsApi(
  exchangeName: string,
): Promise<string[]> {
  try {
    const response = await requestClient.get<TradingPairsResponse>(
      `/trading-pairs/${exchangeName}`,
    );
    return response.trading_pairs || [];
  } catch (error) {
    // The error log suggests the error object *is* the successful response.
    // This handles the case where the request client rejects on a "successful" response.
    const response = error as TradingPairsResponse;
    if (response && response.trading_pairs) {
      return response.trading_pairs;
    }
    // If it's a real error without trading_pairs, return empty and log.
    console.error(`Failed to fetch trading pairs for ${exchangeName}:`, error);
    return [];
  }
}
