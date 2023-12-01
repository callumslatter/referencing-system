import { Body, Controller, Post, Route, SuccessResponse } from "tsoa";
import { IFormattedText } from "./reference";
import { ReferenceService } from "./referenceService";

@Route("formatter")
export class ReferenceController extends Controller {
  constructor(private referenceService = new ReferenceService()) {
    super()
  }
  @Post()
  @SuccessResponse("201", "Created")
  public async formatText(@Body() requestBody: any): Promise<IFormattedText> {
    return this.referenceService.formatText(requestBody.inputText);
  }
}
