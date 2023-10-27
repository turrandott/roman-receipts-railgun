import {
  ApproveERC20SpenderStep,
  Recipe,
  RecipeConfig,
  RecipeERC20Info,
  Step,
  StepInput,
} from "@railgun-community/cookbook";
//import { MIN_GAS_LIMIT_ANY_RECIPE } from "@railgun-community/cookbook/dist/models/min-gas-limits";  It doesn't work for uknown reasons
import { NetworkName } from "@railgun-community/shared-models";

const MIN_GAS_LIMIT_ANY_RECIPE = 2800000n;

export class BasicERC20ApproveRecipe extends Recipe {
  readonly config: RecipeConfig = {
    name: "Approve ERC20 spender",
    description: "Just approves an ERC20 Spender, it's composed of just one step",
    minGasLimit: MIN_GAS_LIMIT_ANY_RECIPE,
  };

  protected readonly spender: string;

  constructor(_spender: string) {
    super();
    this.spender = _spender;
  }

  protected supportsNetwork(networkName: NetworkName): boolean {
    return networkName === NetworkName.EthereumGoerli ? true : false; // Need to change that into the designated chain to make the tests
  }

  protected async getInternalSteps(firstInternalStepInput: StepInput): Promise<Step[]> {
    //const spender = "You need to find a contract address to put here";

    const requestPay_ERC20Info: RecipeERC20Info = {
      tokenAddress: "0xC2C527C0CACF457746Bd31B2a698Fe89de2b6d49", // Goerli USDT address
      decimals: BigInt(6), // USDT decimals
      isBaseToken: false,
    };
    return [new ApproveERC20SpenderStep(this.spender, requestPay_ERC20Info)];
  }
}
