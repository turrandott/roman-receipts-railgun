import { BeefyAPI } from "@railgun-community/cookbook/dist/api/beefy";
import { RecipeConfig, RecipeERC20Info, StepInput } from "@railgun-community/cookbook/dist/models/export-models";
import { MIN_GAS_LIMIT_BEEFY_VAULT_DEPOSIT } from "@railgun-community/cookbook/dist/models/min-gas-limits";
import { Recipe } from "@railgun-community/cookbook/dist/recipes/recipe";
import { ApproveERC20SpenderStep, Step } from "@railgun-community/cookbook/dist/steps";
import { BeefyDepositStep } from "@railgun-community/cookbook/dist/steps/vault/beefy/beefy-deposit-step";
import { NetworkName } from "@railgun-community/shared-models";

export class BeefyDepositRecipe extends Recipe {
  readonly config: RecipeConfig = {
    name: "Beefy Vault Deposit",
    description: "Auto-approves and deposits tokens into a yield-bearing Beefy Vault.",
    minGasLimit: MIN_GAS_LIMIT_BEEFY_VAULT_DEPOSIT,
  };

  protected readonly vaultID: string;

  constructor(vaultID: string) {
    super();
    this.vaultID = vaultID;
  }

  protected supportsNetwork(networkName: NetworkName): boolean {
    return BeefyAPI.supportsNetwork(networkName);
  }

  protected async getInternalSteps(firstInternalStepInput: StepInput): Promise<Step[]> {
    const { networkName } = firstInternalStepInput;
    const vault = await BeefyAPI.getBeefyVaultForID(this.vaultID, networkName);
    const spender = vault.vaultContractAddress;
    const depositERC20Info: RecipeERC20Info = {
      tokenAddress: vault.depositERC20Address,
      decimals: vault.depositERC20Decimals,
    };
    return [new ApproveERC20SpenderStep(spender, depositERC20Info), new BeefyDepositStep(vault)];
  }
}
